import { Router } from 'express'
import { BooksController } from '@/controllers/BooksController'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated'
import { BooksProgressController } from '@/controllers/BooksProgressController'
import { ReviewsBooksController } from '@/controllers/ReviewsBooksController'

export const booksRoute = Router()
const booksController = new BooksController()
const booksProgressController = new BooksProgressController()
const reviewsBooksController = new ReviewsBooksController()

booksRoute.use(ensureAuthenticated)
booksRoute.post('/', booksController.create)
booksRoute.get('/', booksController.index)
booksRoute.get('/:id', booksController.show)
booksRoute.put('/:id', booksController.update)
booksRoute.delete('/:id', booksController.delete)

booksRoute.patch('/:id/progress', booksProgressController.update)
booksRoute.get('/:id/progress', booksProgressController.show)

booksRoute.post('/:id/review', reviewsBooksController.create)
booksRoute.get('/:id/review', reviewsBooksController.show)
