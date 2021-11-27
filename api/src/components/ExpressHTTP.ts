import { Component, ComponentOrServiceHooks } from '@augu/lilith'
import express, { Express } from 'express'
import xPoweredBy from '../middleware/x-powered-by'
import Logger from '../singletons/Logger'

@Component({
	priority: 0,
	name: 'http:api'
})
export default class HTTPExpress implements ComponentOrServiceHooks<any> {
	private logger!: typeof Logger

	#app!: Express
	load() {
		this.logger = Logger.getChildLogger({ name: 'http:api' })

		this.logger.info('Loading API server')

		this.#app = express()

		this.#app.use(xPoweredBy)

		this.#app.listen(4090, () => {
			this.logger.info('API server listening on port 4090')
		})
	}
}