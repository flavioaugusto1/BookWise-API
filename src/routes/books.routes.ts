import { Router } from 'express'
import { BooksController } from '@/controllers/BooksController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'

export const booksRoute = Router()
const booksController = new BooksController()

booksRoute.use(ensureAuthenticated)
booksRoute.post('/', booksController.create)
booksRoute.get('/', booksController.index)
booksRoute.get('/:id', booksController.show)
booksRoute.put('/:id', booksController.update)
booksRoute.delete('/:id', booksController.delete)
