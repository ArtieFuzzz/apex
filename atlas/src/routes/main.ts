import { HttpStatusCode, Message } from '#types'
import { Inject } from '@augu/lilith'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Get, Post } from '../decorators'
import ShortenerService from '../services/Shortener'

export default class MainRouter {
	@Inject
	private readonly ShortURL!: ShortenerService

	@Get('/:id')
	public async AtlasGet(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
		const id: string = req.params.id

		const url = await this.ShortURL.GetURL(id)

		if (!url) {
			reply.code(HttpStatusCode.NOT_FOUND)

			const message: Message = {
				code: HttpStatusCode.NOT_FOUND,
				error: true,
				message: 'ID does not match any document in our database'
			}

			return reply.send(message)
		}

		return reply.redirect(url)
	}

	@Post('/shorten')
	public async AtlasPost(req: FastifyRequest<{ Body: { url?: string } }>, reply: FastifyReply) {
		const url = req.body?.url

		if (!url) {
			reply.code(HttpStatusCode.BAD_REQUEST)

			const message: Message = {
				code: HttpStatusCode.BAD_REQUEST,
				error: false,
				message: 'Please include a url in your request body'
			}

			return reply.send(message)
		}

		const data = await this.ShortURL.Generate(url)

		reply.code(HttpStatusCode.OK)

		return reply.send({ url: data.url, id: data.id })
	}
}