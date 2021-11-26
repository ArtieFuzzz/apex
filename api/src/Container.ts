import { BaseComponent, Container } from '@augu/lilith'
import { join } from 'path'

export const container = new Container({
	componentsDir: join(__dirname, 'components'),
	servicesDir: join(__dirname, 'services')
})

container.on('onBeforeInit', (cs: BaseComponent) => console.log(`Loading ${cs.name}`))
container.on('onAfterInit', (cs: BaseComponent) => console.log(`Loaded ${cs.name}`))
container.on('initError', (cs: BaseComponent) => console.error(`Failed to load ${cs.name}`))