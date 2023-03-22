import { Application, Router } from 'express'

import AuthController, { IAuthController } from '@/controllers/auth.controller'

class Routes {
	router: Router

	authController: IAuthController

	constructor() {
		this.router = Router()
		this.authController = new AuthController()
	}

	setup(app: Application) {
		this.router.get('/health-check', (req, res) => {
			res.send({ ok: true })
		})

		this.router.use('/auth', this.authController.router)

		app.use('/api/', this.router)
	}
}

export default Routes
