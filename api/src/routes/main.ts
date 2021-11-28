import type { FastifyReply, FastifyRequest } from 'fastify'
import { Get } from '../decorators'

export default class MainRoutes {
	@Get('/')
	public root (_req: FastifyRequest, res: FastifyReply) {
		res.send({
			root: true
		})
	}
}