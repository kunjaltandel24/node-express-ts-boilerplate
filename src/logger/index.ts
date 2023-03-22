import { config } from 'dotenv'
import { createLogger, format, transports } from 'winston'

config()

// Winston logger for logging errors and info objects.
export default createLogger({
	transports: new transports.File({
		filename: 'logs/server.log',
		format: format.combine(
			format.errors({ stack: true }),
			format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
			format.align(),
			format.printf((info) => `${info.level}: ${[info.timestamp]}: ${info.message}`),
			format.colorize(),
			format.prettyPrint(),
		),
	}),
})
