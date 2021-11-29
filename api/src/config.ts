import convict from 'convict'
import { existsSync } from 'fs'
import { join } from 'path'

// * Add support for wasabi S3 instances
interface Configuration {
	keyId: string
	secretKey: string
	bucket: string
	region: string
	hostname: string
}

const config = convict<Configuration>({
	keyId: {
		default: ''
	},
	secretKey: {
		default: ''
	},
	bucket: {
		default: ''
	},
	region: {
		default: 'ap-southeast-2'
	},
	hostname: {
		default: 'localhost'
	}
})

if (existsSync(join(__dirname, 'config.json'))) {
	config.loadFile(join(__dirname, 'config.json'))
}


config.validate({ allowed: 'strict' })

export default config.getProperties()
