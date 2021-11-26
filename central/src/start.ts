import { container } from '#apex/api'

(async () => {
	try {
		await container.load()
		
		console.log('Apex has started!')
	} catch (e) {
		console.error(e)
		process.exit(1)
	}
})()
