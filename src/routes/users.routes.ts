import { Router } from 'express'
import { UsersController } from '@/controllers/UsersController'
import { SessionsController } from '@/controllers/SessionsController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'

export const usersRoutes = Router()

const usersController = new UsersController()
const sessionsController = new SessionsController()

usersRoutes.post('/register', usersController.create)
usersRoutes.get(
    '/stats',
    ensureAuthenticated,
    usersController.getTotalPagesReaded,
)

usersRoutes.post('/login', sessionsController.create)
