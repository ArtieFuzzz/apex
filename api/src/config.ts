import convict from 'convict'
import { existsSync } from 'fs'
import { join } from 'path'

interface Configuration {
	keyId: string
	secretKey: string
	bucket: string
	region: string
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
	}
})

if (existsSync(join(__dirname, 'config.json'))) {
	config.loadFile(join(__dirname, 'config.json'))
}


config.validate({ allowed: 'strict' })

export default config.getProperties()
