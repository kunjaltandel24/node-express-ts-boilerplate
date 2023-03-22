import { NextFunction, Request, Response } from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'
import httpStatus from 'http-status'

import { CustomError } from '@/utils/CustomTypes'

export default class ApiResponse {
	sendSuccess(req: Request, res: Response, message: string, data?: unknown) {
		res.send({
			message,
			data,
		})
	}

	sendValidationError(req: Request, res: Response, message: string | string[] | ValidationError[]) {
		let error = ''
		if (message && message.length && typeof message === 'object') {
			message.forEach((err, i) => {
				const msg = typeof err === 'string' ? err : err.msg
				if (i + 2 === message.length) {
					error += `${msg} and `
				} else if (i + 1 === message.length) {
					error += `${msg}`
				} else {
					error += `${msg}, `
				}
			})
		} else {
			error = message.toString()
		}
		res.status(httpStatus.BAD_REQUEST).send({
			statusCode: httpStatus.BAD_REQUEST,
			message: error,
		})
	}

	sendGenericServerFailError(req: Request, res: Response) {
		res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
			statusCode: httpStatus.INTERNAL_SERVER_ERROR,
			message: 'internal server error',
		})
	}

	sendAuthenticationError(req: Request, res: Response, message: string) {
		res.status(httpStatus.UNAUTHORIZED).send({
			statusCode: httpStatus.UNAUTHORIZED,
			message,
		})
	}

	sendNotFoundError(req: Request, res: Response, message: string) {
		res.status(httpStatus.NOT_FOUND).send({
			statusCode: httpStatus.NOT_FOUND,
			message,
		})
	}

	sendGoneError(req: Request, res: Response, message: string) {
		res.status(httpStatus.GONE).send({
			statusCode: httpStatus.GONE,
			message,
		})
	}

	sendForbiddenError(req: Request, res: Response, message: string) {
		res.status(httpStatus.FORBIDDEN).send({
			statusCode: httpStatus.FORBIDDEN,
			message,
		})
	}

	sendConflictError(req: Request, res: Response, message: string) {
		res.status(httpStatus.CONFLICT).send({
			statusCode: httpStatus.CONFLICT,
			message,
		})
	}

	sendExpectationFailed(req: Request, res: Response, message: string) {
		res.status(httpStatus.EXPECTATION_FAILED).send({
			statusCode: httpStatus.EXPECTATION_FAILED,
			message,
		})
	}

	sendTooManyRequests(req: Request, res: Response, message: string) {
		res.status(httpStatus.TOO_MANY_REQUESTS).send({
			statusCode: httpStatus.TOO_MANY_REQUESTS,
			message,
		})
	}

	sendLockedError(req: Request, res: Response, message: string) {
		res.status(httpStatus.LOCKED).send({
			statusCode: httpStatus.LOCKED,
			message,
		})
	}

	sendNotAllowedError(req: Request, res: Response, message: string) {
		res.status(httpStatus.METHOD_NOT_ALLOWED).send({
			statusCode: httpStatus.METHOD_NOT_ALLOWED,
			message,
		})
	}

	sendCustomError(req: Request, res: Response, err: CustomError) {
		if (err && err.notFound) {
			this.sendNotFoundError(req, res, err.message)
		} else if (err && err.forbidden) {
			this.sendForbiddenError(req, res, err.message)
		} else if (err && err.notAllowed) {
			this.sendNotAllowedError(req, res, err.message)
		} else if (err && err.gone) {
			this.sendGoneError(req, res, err.message)
		} else if (err && err.locked) {
			this.sendLockedError(req, res, err.message)
		} else if (err && err.invalidCredential) {
			this.sendForbiddenError(req, res, err.message)
		} else if (err && err.unauthorized) {
			this.sendAuthenticationError(req, res, err.message)
		} else if (err && err.badRequest) {
			this.sendValidationError(req, res, err.message)
		} else if (err && err.conflict) {
			this.sendConflictError(req, res, err.message)
		} else if (err && err.expectationFailed) {
			this.sendExpectationFailed(req, res, err.message)
		} else if (err && err.limitCrossed) {
			this.sendTooManyRequests(req, res, err.message)
		} else {
			this.sendGenericServerFailError(req, res)
		}
	}

	errorFormatter({ location, msg, param }: ValidationError): string {
		return `${location}[${param}]: ${msg}`
	}

	validationCheck(req: Request, res: Response, next: NextFunction) {
		const result: Result = validationResult(req).formatWith(this.errorFormatter)
		if (!result.isEmpty()) {
			return this.sendValidationError(req, res, result.array())
		}
		return next()
	}
}
