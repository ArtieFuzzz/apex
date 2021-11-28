import { BaseComponent, Container } from '@augu/lilith'
import { join } from 'path'
import Logger from './singletons/Logger'

const logger = Logger.getChildLogger({
	name: 'Apex: API'
})

export const container = new Container({
	servicesDir: join(__dirname, 'services'),
	componentsDir: join(__dirname, 'components'),
	singletons: [Logger]

})

container.on('onBeforeInit', (cs: BaseComponent) => logger.info(`Loading ${cs.type} ${cs.name}`))
container.on('onAfterInit', (cs: BaseComponent) => logger.info(`Loaded ${cs.type} ${cs.name}`))
container.on('initError', (cs: BaseComponent) => logger.error(`Failed to load ${cs.name}`))