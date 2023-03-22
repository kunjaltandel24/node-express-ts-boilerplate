import {
	NextFunction, Request, Response, Router,
} from 'express'
import { JwtPayload } from 'jsonwebtoken'

import IUser from '@/interfaces/IUser'
import logger from '@/logger'
import Users from '@/models/Users'
import AuthService, { IAuthService } from '@/services/auth.service'
import ApiResponse from '@/utils/apiResponse'
import { CustomError } from '@/utils/CustomTypes'
import { verifyToken } from '@/utils/jwt'

export interface IAuthController {
	router: Router
	authService: IAuthService

	login(req: Request, res: Response): Promise<void>
	register(req: Request, res: Response): Promise<void>
	verify(req: Request, res: Response): Promise<void>
}

export default class AuthController extends ApiResponse implements IAuthController {
	router: Router

	authService: IAuthService

	constructor() {
		super()
		this.authService = new AuthService()
		this.router = Router()

		this.router.post('/login', this.authService.userSigninValidationChain, this.login)
		this.router.post('/register', this.authService.userSignupValidationChain, this.register)
		this.router.post('/verify', this.verify)
	}

	static UserAuthMiddleware(ignore = false) {
		return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const authCtrl = new AuthController()
			try {
				const cookies: { [key: string]: string } = Object.fromEntries((req.headers.cookie || '').split('; ')
					.map((cookie) => [cookie.split('=')[0], cookie.split('=')[1]]))
				if (!req.headers.token && !cookies.token && ignore) {
					return next()
				}
				if (!req.headers.token && !cookies.token && !ignore) {
					return authCtrl.sendValidationError(req, res, 'auth token is required')
				}
				const decoded: JwtPayload = await verifyToken(req.headers.token || cookies.token)
				const user: IUser | null = await Users.findOne({ _id: decoded.uid })
					.exec()
				if (!user) {
					return authCtrl.sendAuthenticationError(req, res, 'token is not valid authentication token')
				}
				res.locals.user = user
				return next()
			} catch (error) {
				const err = error as CustomError
				logger.error('error in UserAuthMiddleware of AuthController method', error)
				return authCtrl.sendCustomError(req, res, err)
			}
		}
	}

	static async AllowOnlyVerifiedUserMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
		const authCtrl = new AuthController()
		if (!res.locals.user.isVerified) {
			return authCtrl.sendAuthenticationError(req, res, 'user is not verified')
		}
		return next()
	}

	async login(req: Request, res: Response): Promise<void> {
		try {
			const user = await this.authService.userSignin(req.body, res)
			return this.sendSuccess(req, res, 'logged in successfully', user)
		} catch (error) {
			logger.error('error in login AuthController method', error)
			return this.sendCustomError(req, res, error as CustomError)
		}
	}

	async register(req: Request, res: Response): Promise<void> {
		try {
			const user = await this.authService.userSignup(req.body, res)
			return this.sendSuccess(req, res, 'user registered in successfully', user)
		} catch (error) {
			logger.error('error in register AuthController method', error)
			return this.sendCustomError(req, res, error as CustomError)
		}
	}

	async verify(req: Request, res: Response): Promise<void> {
		try {
			const user = await this.authService.userVerification(req.body)
			return this.sendSuccess(req, res, 'user verified successfully', user)
		} catch (error) {
			logger.error('error in register AuthController method', error)
			return this.sendCustomError(req, res, error as CustomError)
		}
	}
}
