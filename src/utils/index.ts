import { Types } from 'mongoose'
import * as validator from 'validator'

import AppConfig from '@/AppConfig'

const appConfig = AppConfig()

export const appendCDNUrl = (fileKey?: string) => {
	if (fileKey && !validator.isURL(fileKey)) {
		return `${appConfig.APP_URL}/${fileKey}`
	}
	return fileKey
}

export const isValidObjectId = (id: string): boolean => {
	if (Types.ObjectId.isValid(id)) {
		const nObjId = new Types.ObjectId(id)
		return nObjId.toString() === id
	}
	return false
}

export const generateRandomString = (length = 6): string => {
	let result = ''
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let charactersLength = characters.length
	for (let i = 0; i < length; i += 1) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}
