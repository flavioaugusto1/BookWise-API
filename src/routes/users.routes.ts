import { Router } from 'express'
import { UsersController } from '@/controllers/UsersController'

export const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post('/register', usersController.create)
