import { Inject } from '@augu/lilith'
import { fetch, FetchResultTypes } from '@sapphire/fetch'
import { FastifyReply, FastifyRequest } from 'fastify'
import config from '../config'
import { Get } from '../decorators'
import ImageService from '../services/images'
import OsuService from '../services/osu'

export default class MainRouter {
	@Inject
	private readonly images!: ImageService

	@Inject
	private readonly osu!: OsuService

	@Get('/')
	public root (_req: FastifyRequest, res: FastifyReply) {
		res.send({
			message: 'Hello world!'
		})
	}

	@Get('/memes')
	public Memes (_req: FastifyRequest, res: FastifyReply) {
		res.send({
			url: this.images.random('memes')
		})
	}

	@Get('/animals')
	public Animals (_req: FastifyRequest, res: FastifyReply) {
		res.send({
			url: this.images.random('animals')
		})
	}

	@Get('/i/:kind/:id')
	public async CDN (req: FastifyRequest<{ Params: { kind: string, id: string} }>, res: FastifyReply) {
		const { kind, id } = req.params
		const img = await fetch(`https://${config.s3.bucket}.s3.${config.s3.region}.amazonaws.com/${kind}/${id}`, FetchResultTypes.Buffer)

		res.header('Content-Type', this.ImageType(img))

		return res.send(img)
	}

	@Get('/osu/:user')
	public async osuGetUser (req: FastifyRequest<{ Params: { user: string } }>, res: FastifyReply) {
		const { user } = req.params
		const userData = await this.osu.getUser(user)

		return res.send(userData)
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