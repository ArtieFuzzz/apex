import { ComponentOrServiceHooks, Service } from '@augu/lilith'
import { CreateBucketCommand, ListBucketsCommand, ListObjectsCommand, S3Client } from '@aws-sdk/client-s3'
import Logger from '../singletons/Logger'

type ImageTypes = 'memes'
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
	private logger!: typeof Logger

	public async load(): Promise<any> {
		this.logger = Logger.getChildLogger({ name: 'service:image' })
		this.S3 = new S3Client({
			credentials: {
			  secretAccessKey: 'mCo060+46BEO0V9lFZdHst4vDynFWdqZshi6wKhV',
			  accessKeyId: 'AKIAZJC7CNSEWH3VEOEV'
			},
			region: process.env.region ?? 'ap-southeast-2'
		})

		const { Buckets } = await this.S3.send(new ListBucketsCommand({}))

		if (!Buckets?.find((b) => b.Name === 'rt-03')) {
			this.logger.warn(`Bucket not found. Creating a new bucket with the name of ${process.env.BUCKET_NAME}`)

			await this.S3.send(new CreateBucketCommand({ Bucket: 'rt-03' }))
			this.logger.info('Bucket created.')
		}

		const Objs = await this.S3.send(new ListObjectsCommand({ Bucket: 'rt-03' }))

		if (!Objs) return this.logger.error('Bucket had no content')

		this.Pool = {
			memes: Objs.Contents!.filter((i) => i.Key! !== 'memes/').filter((i) => i.Key!.startsWith('memes/')).map((i) => `localhost:3000/i/${i.Key!}`)
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