import { container as Atlas } from '#apex/atlas'
import { container as Phoenix } from '#apex/phoenix'
import Logger from '#apex/phoenix/singletons/Logger'

const logger = Logger.getChildLogger({
	name: 'Apex: Central Control'
});

(async () => {
	logger.info('Initiating!')
	try {
		await Phoenix.load()
		await Atlas.load()

		logger.info('Apex has started!')
	} catch (e) {
		logger.error(e)

		process.exit(1)
	}

	process.once('SIGINT', () => {
		logger.warn('Termination signal received.')

		stop()
	})

	process.once('SIGTERM', () => {
		logger.warn('Termination signal received.')

		stop()
	})
})()

function stop() {
	logger.warn('Exiting in 5 seconds...')

	return setTimeout(() => {
		logger.warn('Exiting...')
		Phoenix.dispose()
		process.exit(0)
	}, 5000)
}
