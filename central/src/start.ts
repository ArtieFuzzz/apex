import { container } from '#apex/api'
import Logger from '#apex/api/singletons/Logger'

(async () => {
	const logger = Logger.getChildLogger({
		name: 'Apex: Central Control'
	})

	try {
		await container.load()
		
		logger.info('Apex has started!')
	} catch (e) {
		logger.error(e)
		process.exit(1)
	}
})()
