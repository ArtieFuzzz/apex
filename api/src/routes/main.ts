import { Inject } from '@augu/lilith'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Get } from '../decorators'
import ImageService from '../services/Image'

export default class MainRouter {
	@Inject
	private readonly images!: ImageService

	@Get('/')
	public root (_req: FastifyRequest, res: FastifyReply) {
		res.send({
			message: 'Hello world!'
		})
	}

	@Get('/memes')
	public memes (_req: FastifyRequest, res: FastifyReply) {
		res.send({
			url: this.images.random()
		})
	}
}