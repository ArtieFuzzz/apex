import { Component, ComponentOrServiceHooks } from '@augu/lilith'
import express, { Express } from 'express'
import xPoweredBy from '../lib/middleware/x-powered-by'

@Component({
	priority: 0,
	name: 'express'
})
export default class ExpressHTTP implements ComponentOrServiceHooks {
	#app!: Express
	load() {
		this.#app = express()

		this.#app.use(xPoweredBy)

		this.#app.listen(80, () => {
			console.log('Listening on port 80')
		})
	}
}