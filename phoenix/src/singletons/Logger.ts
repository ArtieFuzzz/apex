import { Logger } from 'tslog'

const logger = new Logger({
	displayFunctionName: true,
	exposeErrorCodeFrame: true,
	displayInstanceName: true,
	displayFilePath: 'hideNodeModulesOnly',
	dateTimePattern: '[ day-month-year / hour:minute:second ]',
  	displayTypes: false,
  	name: 'Apex',
})

export default logger