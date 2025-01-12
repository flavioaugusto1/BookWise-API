import { Router } from 'express'
import { usersRoutes } from './users.routes'
import { booksRoute } from './books.routes'

export const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/books', booksRoute)
