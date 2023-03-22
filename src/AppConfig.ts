import dotenv from 'dotenv'

dotenv.config()

interface IAppConfig {
	PORT: string
	NODE_ENV: string
	JWT_SECRET: string
	APP_URL: string
	CLIENT_URL: string
	MONGO_CONNECTION: string
	SES_EMAIL: string
	SES_HOST: string
	SES_USER: string
	SES_PASS: string
	[key: string]: string
}

const AppConfig = (): IAppConfig => {
	if (!process.env.PORT) {
		throw new Error('PORT is required')
	}
	if (!process.env.NODE_ENV) {
		throw new Error('NODE_ENV is required')
	}
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is required')
	}
	if (!process.env.APP_URL) {
		throw new Error('APP_URL is required')
	}
	if (!process.env.CLIENT_URL) {
		throw new Error('CLIENT_URL is required')
	}
	if (!process.env.MONGO_CONNECTION) {
		throw new Error('CLIENT_URL is required')
	}
	if (!process.env.SES_EMAIL) {
		throw new Error('SES_EMAIL is required')
	}
	if (!process.env.SES_HOST) {
		throw new Error('SES_HOST is required')
	}
	if (!process.env.SES_USER) {
		throw new Error('SES_USER is required')
	}
	if (!process.env.SES_PASS) {
		throw new Error('SES_PASS is required')
	}

	return {
		PORT: process.env.PORT,
		NODE_ENV: process.env.NODE_ENV,
		JWT_SECRET: process.env.JWT_SECRET,
		APP_URL: process.env.APP_URL,
		CLIENT_URL: process.env.CLIENT_URL,
		MONGO_CONNECTION: process.env.MONGO_CONNECTION,
		SES_EMAIL: process.env.SES_EMAIL,
		SES_HOST: process.env.SES_HOST,
		SES_USER: process.env.SES_USER,
		SES_PASS: process.env.SES_PASS,
	}
}

export default AppConfig
