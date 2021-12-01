import { ComponentOrServiceHooks, Inject, Service } from '@augu/lilith'
import { CreateBucketCommand, ListBucketsCommand, ListObjectsCommand, S3Client } from '@aws-sdk/client-s3'
import { Logger } from 'tslog'
import config from '../config'

type ImageTypes = 'memes' | 'animals'
type Pool = {
	[K in ImageTypes]: string[]
}

@Service({
	priority: 0,
	name: 'images'
})
export default class ImageService implements ComponentOrServiceHooks {
	protected S3!: S3Client
	protected Pool!: Pool
	protected poolRefresh!: NodeJS.Timer

	@Inject
	private readonly logger!: Logger

	public async load() {
		// * Add support for wasabi S3 instances
		this.S3 = new S3Client({
			credentials: {
				secretAccessKey: config.s3.secretKey,
				accessKeyId: config.s3.keyId
			},
			region: config.s3.region
		})

		const { Buckets } = await this.S3.send(new ListBucketsCommand({}))

		if (!Buckets?.find((b) => b.Name === config.s3.bucket)) {
			this.logger.warn(`Bucket not found. Creating a new bucket with the name of ${config.s3.bucket}`)

			await this.S3.send(new CreateBucketCommand({ Bucket: config.s3.bucket }))
			this.logger.info('Bucket created.')
		}

		const Objs = await this.S3.send(new ListObjectsCommand({ Bucket: config.s3.bucket }))

		if (!Objs) {
			this.logger.error('Bucket had no content')
			return
		}

		this.Pool = {
			memes: Objs.Contents!.filter((i) => i.Key! !== 'memes/').filter((i) => i.Key!.startsWith('memes/')).map((i) => `${config.hostname}/i/${i.Key!}`),
			animals: Objs.Contents!.filter((i) => i.Key! !== 'animals/').filter((i) => i.Key!.startsWith('animals/')).map((i) => `${config.hostname}/i/${i.Key!}`)
		}

		this.poolRefresh = setInterval(async () => await this.refreshPool() , 43200000)

		return
	}

	protected async refreshPool() {
		this.logger.info('Refreshing image cache')

		const newObjs = await this.S3.send(new ListObjectsCommand({ Bucket: config.s3.bucket }))

		if (!newObjs) {
			this.logger.error('Bucket had no content')
			return
		}

		return this.Pool = {
			memes: newObjs.Contents!.filter((i) => i.Key! !== 'memes/').filter((i) => i.Key!.startsWith('memes/')).map((i) => `${config.hostname}/i/${i.Key!}`),
			animals: newObjs.Contents!.filter((i) => i.Key! !== 'animals/').filter((i) => i.Key!.startsWith('animals/')).map((i) => `${config.hostname}/i/${i.Key!}`)
		}
	}

	public random(kind: ImageTypes) {
		const P = this.Pool[kind]
		return P[Math.floor(Math.random() * P.length)]
	}

	public dispose() {
		clearTimeout(this.poolRefresh)
		this.S3.destroy()
	}
}