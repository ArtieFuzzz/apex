import convict from 'convict'
import { existsSync } from 'fs'
import { join } from 'path'

interface Configuration {
	mongoURI: string
}


const config = convict<Configuration>({
	mongoURI: {
		default: '',
		env: 'MONGO_URI'
	}
})

if (existsSync(join(__dirname, 'config.json'))) {
	config.loadFile(join(__dirname, 'config.json'))
}


config.validate({ allowed: 'strict' })

export default config.getProperties()
