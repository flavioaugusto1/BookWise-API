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

booksRoute.get('/', booksController.index)
booksRoute.get('/stats', booksProgressController.getStats)
booksRoute.get('/:id', booksController.show)
booksRoute.get('/:id/progress', booksProgressController.show)
booksRoute.get('/:id/review', reviewsBooksController.show)

booksRoute.put('/:id', booksController.update)
booksRoute.patch('/:id/progress', booksProgressController.update)

booksRoute.delete('/:id', booksController.delete)

booksRoute.post('/', booksController.create)
booksRoute.post('/:id/review', reviewsBooksController.create)
