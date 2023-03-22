import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'

import AppConfig from '@/AppConfig'
import logger from '@/logger'
import Routes from '@/routes'

// Initialise by connecting to the db and crons can be intiated here.
const initialise = async () => {
	const appConfig = AppConfig()
	const connectionUri: string = appConfig.MONGO_CONNECTION
	await mongoose.connect(connectionUri, {})
	console.log('Connected to MongoDB')

	const app = express()

	app.use(cors())
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: false }))

	// Starting point, all routes after this will be directed to routes.ts.
	const routes = new Routes()
	routes.setup(app)

	// Start Server
	app.listen(appConfig.PORT, () => {
		console.log('Backend Server has started')
	})
}

initialise()
	.catch((error) => {
		logger.info('error in connecting to db', error)
		process.exit()
	})
