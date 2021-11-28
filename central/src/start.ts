import { container } from '#apex/api'
import Logger from '#apex/api/singletons/Logger'

const logger = Logger.getChildLogger({
	name: 'Apex: Central Control'
});

(async () => {
	try {
		await container.load()
		
		logger.info('Apex has started!')
	} catch (e) {
		logger.error(e)

		process.exit(1)
	}

	process.once('SIGINT', () => {
		logger.warn('Termination signal received. Exiting in 5 seconds...')

		stop()
	})

	process.once('SIGTERM', () => {
		logger.warn('Termination signal received. Exiting in 5 seconds...')

		stop()
	})
})()

function stop() {
	setTimeout(() => {
		logger.warn('Exiting...')
		container.dispose()
		process.exit(0)
	}, 5000)
}
