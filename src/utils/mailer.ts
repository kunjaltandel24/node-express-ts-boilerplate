import { createTransport } from 'nodemailer'

import AppConfig from '@/AppConfig'

const appConfig = AppConfig()

const transporter = createTransport({
	host: appConfig.SES_HOST,
	port: 465,
	secure: true,
	auth: {
		user: appConfig.SES_USER,
		pass: appConfig.SES_PASS,
	},
})

export default ({ to, subject, body: html }) => new Promise((res, rej) => {
	let senderEmail = appConfig.SES_EMAIL

	const defaultOptions = {
		from: `Support ${senderEmail}`,
		to,
		subject,
		html,
		headers: {
			'X-SES-CONFIGURATION-SET': 'Test-was',
			'X-SES-MESSAGE-TAGS': 'testaws=Null',
		},
	}
	if (transporter) {
		transporter.sendMail(defaultOptions, (error, info) => {
			if (error) {
				console.log('Error sening email', error)
				return rej(error)
			}
			return res(info)
		})
	}
})
