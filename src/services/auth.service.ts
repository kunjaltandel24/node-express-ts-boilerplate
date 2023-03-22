import bcrypt from 'bcryptjs'
import { Response } from 'express'
import { body, ValidationChain } from 'express-validator'
import { omit } from 'lodash'
import { LeanDocument } from 'mongoose'

import AppConfig from '@/AppConfig'
import IUser from '@/interfaces/IUser'
import logger from '@/logger'
import Users from '@/models/Users'
import { Omit } from '@/utils/CustomTypes'
import { signToken, verifyToken } from '@/utils/jwt'
import mailer from '@/utils/mailer'

const { CLIENT_URL } = AppConfig()

export interface IUserSigninParams {
	username: string
	password: string
}

export interface IUserSignupParams {
	email: string
	username: string
	password: string
}
export interface IUserVerificationParams {
	verificationToken: string
}

export interface IAuthService {
	userSigninValidationChain: ValidationChain[]
	userSignupValidationChain: ValidationChain[]

	userSignin(bodyParams: IUserSigninParams, res: Response): Promise<{
		token: string,
		user: Omit<LeanDocument<IUser>, 'password'>
	}>
	userSignup(bodyParams: IUserSignupParams, res: Response): Promise<{
		token: string,
		user: Omit<LeanDocument<IUser>, 'password'>
	}>
	userVerification(bodyParams: IUserVerificationParams): Promise<{
		user: Omit<LeanDocument<IUser>, 'password'>
	}>
}

export default class AuthService implements IAuthService {
	userSigninValidationChain: ValidationChain[] = [
		body('username', 'username is required')
			.exists()
			.matches(/^(\w){1,15}$/i)
			.withMessage('username is not valid'),
		body('password', 'password is required')
			.exists()
			.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
			.withMessage('password is not valid'),
	]

	userSignupValidationChain: ValidationChain[] = [
		body('email', 'email is required')
			.exists()
			.isEmail()
			.withMessage('email is not valid'),
		body('username', 'username is required')
			.exists()
			.matches(/^(\w){1,15}$/i)
			.withMessage('username is not valid'),
		body('password', 'password is required')
			.exists()
			.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
			.withMessage('password is not valid'),
	]

	constructor() {
	}

	async userSignin(bodyParams: IUserSigninParams, res: Response): Promise<{
		token: string,
		user: Omit<LeanDocument<IUser>, 'password'>
	}> {
		const { username, password } = bodyParams

		const user = await Users.findOne({ $or: [{ username }, { email: username }] })
			.exec()

		if (!user) {
			throw {
				conflict: true,
				message: 'no email or username found',
			}
		}

		if (!bcrypt.compareSync(password, user.password)) {
			throw {
				unauthorized: true,
				message: 'username or password incorrect',
			}
		}

		const token: string = signToken({ uid: user._id.toString() })

		res.cookie('token', token)

		return {
			token,
			user: omit(user.toJSON(), ['password']),
		}
	}

	async userSignup(bodyParams: IUserSignupParams, res: Response): Promise<{
		token: string,
		user: Omit<LeanDocument<IUser>, 'password'>
	}> {
		const { username, email, password } = bodyParams

		let existingUsers: number = await Users.count({ $or: [{ username }, { email }] })
			.exec()

		if (existingUsers) {
			throw {
				conflict: true,
				message: 'email or username already exists',
			}
		}
		const user = new Users({
			username,
			email,
			password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
		})

		await user.save()

		const verificationToken = signToken({
			email,
			code: bcrypt.hashSync(user.verificationCode, bcrypt.genSaltSync(12)),
		})

		mailer({
			to: email,
			subject: 'Account verification',
			body: `verify your account through following link\n${CLIENT_URL}/verify?vt=${verificationToken}`,
		})
			.catch((error) => {
				logger.error('failed to send verification email: ', error)
			})

		const token: string = signToken({ uid: user._id.toString() })

		res.cookie('token', token)

		return {
			token,
			user: omit(user.toJSON(), ['password']),
		}
	}

	async userVerification(bodyParams: IUserVerificationParams): Promise<{
		user: Omit<LeanDocument<IUser>, 'password'>
	}> {
		const { verificationToken } = bodyParams

		if (!verificationToken) {
			throw {
				badRequest: true,
				message: 'verification token is not provided',
			}
		}

		const { email, code } = await verifyToken(verificationToken)

		const user = await Users.findOne({ email })
			.select('-password')
			.exec()

		if (!user) {
			throw {
				notFound: true,
				message: 'email does not exists',
			}
		}

		if (!bcrypt.compareSync(user.verificationCode, code)) {
			throw {
				unauthorized: true,
				message: 'invalid verification code',
			}
		}

		await user.save()

		return {
			user: omit(user.toJSON(), ['password']),
		}
	}
}
