import { Component, ComponentOrServiceHooks, Inject } from '@augu/lilith'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { join } from 'path'
import { Logger } from 'tslog'
import { MetadataKeys, RouteDefinition } from '../types'

@Component({
	priority: 0,
	name: 'api:server',
	children: join(__dirname, '..', 'routes')
})
export default class HTTP implements ComponentOrServiceHooks<any> {
	@Inject
	private readonly logger!: Logger

	#app!: ReturnType<typeof fastify>

	public load() {
		this.#app = fastify()
		this.#app
		.addHook('onRequest', (_, res, done) => {
			res.headers({
				'Cache-Control': 'public, max-age=7776000',
				'X-Powered-By': 'ArtieFuzzz (https://github.com/ArtieFuzzz)'
			})

			done()
		})
		.setNotFoundHandler((req, reply) => {
			return reply.code(404).send({
				code: 404,
				error: false,
				message: `Couldn't find the route specified: ${req.url}`
			})
		})
		.setErrorHandler((err, _, reply): any => {
			this.logger.fatal('Uh oh something went very wrong.', err)

			return reply.code(500).send({
				code: 500,
				message: 'Something went wrong at our end',
				error: true,
				error_message: `[${err.name}:${err.code}]: ${err.message}`
			})
		})

		return this.#app.listen(4090, () => {
			this.logger.info('API server listening on port 4090')
		})
	}

	onChildLoad(endpoint: any) {
		const routes = Reflect.getMetadata<RouteDefinition[]>(MetadataKeys.APIRoute, endpoint)
		
		if (routes.length === 0) {
			return this.logger.warn(`Route class has no routes / endpoints`)
		}

		for (const route of routes) {
			this.logger.info(`Loading route: ${route.path}`)

			// @ts-expect-error
			this.#app[route.method](route.path, async (req: FastifyRequest, res: FastifyReply, next: Fastify) => {
				try {
					await route.run.call(endpoint, req, res)
				} catch (err) {
					this.logger.error(err)
				}
			})
		}

		return
	}
}