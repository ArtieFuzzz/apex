import { HttpStatusCode, Message, MetadataKeys, RouteDefinition } from '#types'
import { Component, ComponentOrServiceHooks } from '@augu/lilith'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { join } from 'path'
import Logger from '../singletons/Logger'

@Component({
	priority: 0,
	name: 'api:server',
	children: join(__dirname, '..', 'routes')
})
export default class HTTP implements ComponentOrServiceHooks<unknown> {
	private logger!: typeof Logger

	#app!: ReturnType<typeof fastify>

	public load() {
		this.logger = Logger.getChildLogger({ name: 'Apex: Atlas' })

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
				reply.code(HttpStatusCode.NOT_FOUND)
				return reply.code(HttpStatusCode.NOT_FOUND).send({
					code: HttpStatusCode.NOT_FOUND,
					error: false,
					message: `Couldn't find the route specified: ${req.url}`
				})
			})
			.setErrorHandler(async (err, _, reply) => {
				this.logger.fatal('Uh oh something went very wrong.', err)

				reply.code(HttpStatusCode.INTERNAL_SERVER_ERROR)
				return reply.send({
					code: HttpStatusCode.INTERNAL_SERVER_ERROR,
					message: 'Something went wrong at our end',
					error: true,
					error_message: `[${err.name}:${err.code}]: ${err.message}`
				})
			})

		return this.#app.listen(4091, () => {
			this.logger.info('Atlas API server listening on port 4091')
		})
	}

	onChildLoad(endpoint: unknown) {
		const routes = Reflect.getMetadata<RouteDefinition[]>(MetadataKeys.APIRoute, endpoint)

		if (!routes) {
			return this.logger.warn(`Route class has no routes / endpoints`)
		}

		for (const route of routes) {
			this.logger.info(`Loading route: ${route.path}`)

			// @ts-expect-error
			this.#app[route.method](route.path, async (req: FastifyRequest, res: FastifyReply) => {
				try {
					// @ts-ignore
					await route.run.call(endpoint, req, res)
				} catch (err) {
					this.logger.fatal(`Uh oh! The server could not run the route: ${route.path}\n`, err)
					res.code(HttpStatusCode.INTERNAL_SERVER_ERROR)

					const message: Message = {
						code: HttpStatusCode.INTERNAL_SERVER_ERROR,
						error: true,
						message: `Uh oh! Something went wrong in our backend.`,
					}

					return res.send(message)
				}
			})
		}

		return
	}
}