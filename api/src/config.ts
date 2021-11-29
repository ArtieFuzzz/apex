import convict from 'convict'
import { existsSync } from 'fs'
import { join } from 'path'

// * Add support for wasabi S3 instances
interface Configuration {
	hostname: string
	s3: {
		keyId: string
		secretKey: string
		bucket: string
		region: string
	}
	osu: {
		client_id: string
		client_secret: string
	}
	spotify: {
		client_id: string
		client_secret: string
	}
}


const config = convict<Configuration>({
	s3: {
		keyId: {
			default: '',
			env: 'S3_KEY_ID'
		},
		secretKey: {
			default: '',
			env: 'S3_SECRET_KEY'
		},
		bucket: {
			default: '',
			env: 'S3_BUCKET'
		},
		region: {
			default: 'ap-southeast-2',
			env: 'S3_REGION'
		}
	},
	osu: {
		client_id: {
			default: '',
			env: 'OSU_CLIENT_ID'
		},
		client_secret: {
			default: '',
			env: 'OSU_CLIENT_SECRET'
		}
	},
	spotify: {
		client_id: {
			default: '',
			env: 'SPOTIFY_CLIENT_ID'
		},
		client_secret: {
			default: '',
			env: 'SPOTIFY_CLIENT_SECRET'
		}
	},
	hostname: {
		default: 'localhost',
		env: 'HOSTNAME'
	}
})

if (existsSync(join(__dirname, 'config.json'))) {
	config.loadFile(join(__dirname, 'config.json'))
}


config.validate({ allowed: 'strict' })

export default config.getProperties()
