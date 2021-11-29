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

	@Inject
	private readonly logger!: Logger

	public async load(): Promise<any> {
		// * Add support for wasabi S3 instances
		this.S3 = new S3Client({
			credentials: {
			  secretAccessKey: config.secretKey,
			  accessKeyId: config.keyId
			},
			region: config.region
		})

		const { Buckets } = await this.S3.send(new ListBucketsCommand({}))

		if (!Buckets?.find((b) => b.Name === config.bucket)) {
			this.logger.warn(`Bucket not found. Creating a new bucket with the name of ${config.bucket}`)

			await this.S3.send(new CreateBucketCommand({ Bucket: config.bucket }))
			this.logger.info('Bucket created.')
		}

		const Objs = await this.S3.send(new ListObjectsCommand({ Bucket: config.bucket }))

		if (!Objs) return this.logger.error('Bucket had no content')

		this.Pool = {
			memes: Objs.Contents!.filter((i) => i.Key! !== 'memes/').filter((i) => i.Key!.startsWith('memes/')).map((i) => `${config.hostname}/i/${i.Key!}`),
			animals: Objs.Contents!.filter((i) => i.Key! !== 'animals/').filter((i) => i.Key!.startsWith('animals/')).map((i) => `${config.hostname}/i/${i.Key!}`)
		}
	}

	public random() {
		const P = this.Pool.memes
		P[Math.floor(Math.random() * P.length)]
	}

	public dispose() {
		this.logger.warn('Disposing Image service')
		this.S3.destroy()
	}
} 