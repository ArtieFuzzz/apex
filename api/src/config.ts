import convict from 'convict'
import { existsSync } from 'fs'
import { join } from 'path'

// * Add support for wasabi S3 instances
interface Configuration {
	s3: {
		keyId: string
		secretKey: string
		bucket: string
		region: string
		hostname: string
	}
	osu: {
		client_id: string
		client_secret: string
	}
}


const config = convict<Configuration>({
	s3: {
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
	},
	osu: {
		client_id: {
			default: ''
		},
		client_secret: {
			default: ''
		}
	}
})

if (existsSync(join(__dirname, 'config.json'))) {
	config.loadFile(join(__dirname, 'config.json'))
}


config.validate({ allowed: 'strict' })

export default config.getProperties()
