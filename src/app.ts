import 'express-async-errors'
import express, { Request, Response, NextFunction } from 'express'
import { errorHandling } from './middlewares/errorHandling'

export const app = express()
app.use(express.json())

app.use(
    (error: any, request: Request, response: Response, next: NextFunction) => {
        errorHandling(error, request, response, next)
    },
)
