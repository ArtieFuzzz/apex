import { Component, ComponentOrServiceHooks } from '@augu/lilith'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { join } from 'path'
import Logger from '../singletons/Logger'
import { MetadataKeys, RouteDefinition } from '../types'

@Component({
	priority: 0,
	name: 'http:api',
	children: join(__dirname, '..', 'routes')
})
export default class HTTPAPI implements ComponentOrServiceHooks<any> {
	private logger!: typeof Logger

	#app!: ReturnType<typeof fastify>

	load() {
		this.logger = Logger.getChildLogger({ name: 'http:api' })

		this.logger.info('Loading API server')

		this.#app = fastify()
		this.#app
		.addHook('onRequest', (_, res, done) => {
			res.headers({
				'Cache-Control': 'public, max-age=7776000',
				'X-Powered-By': 'ArtieFuzzz | Aussie TypeScript Developer'
			})

			done()
		})

		this.#app.listen(4090, () => {
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