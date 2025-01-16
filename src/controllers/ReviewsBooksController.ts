import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import { z } from 'zod'

export class ReviewsBooksController {
    async create(request: Request, response: Response) {
        const requestBodySchema = z.object({
            grade: z.coerce.number().min(0),
            comment: z.string().trim().min(1),
        })

        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = requestParamSchema.parse(request.params)
        const { grade, comment } = requestBodySchema.parse(request.body)
        const { id: user_id } = request.user

        const book = await prisma.book.findFirst({
            where: {
                id,
            },
        })

        if (!book || book.user_id !== user_id) {
            throw new AppError(
                'Não foi possível localizar o livro informado.',
                404,
            )
        }

        const review = await prisma.review.create({
            data: {
                grade,
                comment,
                book_id: id,
                user_id,
            },
        })

        response.status(201).json({
            review,
        })
    }

    async show(request: Request, response: Response) {}
}
