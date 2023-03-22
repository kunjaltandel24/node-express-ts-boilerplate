import { JwtPayload, sign, verify } from 'jsonwebtoken'

import AppConfig from '@/AppConfig'

const appConfig = AppConfig()
export const signToken = (data, time = '365d'): string => sign({
	...data,
}, appConfig.JWT_SECRET, { expiresIn: time })

export const verifyToken = (token): Promise<JwtPayload> => (new Promise<JwtPayload>((resolve, reject) => {
	verify(token, appConfig.JWT_SECRET, (err, decoded) => {
		if (err) {
			return reject(err)
		}

		return resolve(decoded)
	})
}))
