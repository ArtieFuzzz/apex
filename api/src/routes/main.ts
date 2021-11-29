import { Inject } from '@augu/lilith'
import { fetch, FetchResultTypes } from '@sapphire/fetch'
import { FastifyReply, FastifyRequest } from 'fastify'
import config from '../config'
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

	@Get('/i/:kind/:id')
	public async CDN (req: FastifyRequest<{ Params: any }>, res: FastifyReply) {
		const { kind, id } = req.params
		const img = await fetch(`https://${config.bucket}.s3.${config.region}.amazonaws.com/${kind}/${id}`, FetchResultTypes.Buffer)

		res.header('Content-Type', this.ImageType(img))

		return res.send(img)
	}

	private ImageType(buffer: Buffer) {
		const IntArray = new Int32Array(buffer)

		switch (IntArray[0]) {
			case 137: {
				return {
					mime: 'image/png'
				}
			}
			case 255: {
				return {
					mime: 'image/jpg'
				}
			}
			/* case 944130375: {
				return {
					mime: 'image/gif'
				}
			} */

			default: {
				throw Error('Could not resolve image type')
			}
		}
	}
}