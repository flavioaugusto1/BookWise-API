import { Router } from 'express'
import { UsersController } from '@/controllers/UsersController'
import { SessionsController } from '@/controllers/SessionsController'

export const usersRoutes = Router()

const usersController = new UsersController()
const sessionsController = new SessionsController()

usersRoutes.post('/register', usersController.create)
usersRoutes.post('/login', sessionsController.create)
