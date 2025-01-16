import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import { z } from 'zod'

export class BooksProgressController {
    async update(request: Request, response: Response) {
        const requestBodySchema = z.object({
            readedPages: z.number().int().min(0),
        })

        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const { readedPages } = requestBodySchema.parse(request.body)
        const { id } = requestParamSchema.parse(request.params)

        const book = await prisma.book.findFirst({
            where: {
                id,
            },
        })

        if (!book) {
            throw new AppError('O livro informado não existe', 404)
        }

        const { id: user_id } = request.user

        if (book.user_id !== user_id) {
            throw new AppError('Você não possui esse livro cadastrado', 404)
        }

        if (readedPages > book.numberOfPages) {
            throw new AppError(
                'O número de páginas lidas está maior que o número de páginas do livro.',
                409,
            )
        }

        await prisma.book.update({
            data: {
                readedPages,
            },
            where: {
                id,
            },
        })

        response.json({ message: 'Número de páginas atualizadas com sucesso!' })
    }

    async show(request: Request, response: Response) {
        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = requestParamSchema.parse(request.params)

        const book = await prisma.book.findFirst({
            where: {
                id,
            },
        })

        if (!book) {
            throw new AppError('O livro informado não existe', 404)
        }

        const { id: user_id } = request.user

        if (book.user_id !== user_id) {
            throw new AppError('Você não possui esse livro cadastrado', 404)
        }

        const { readedPages, numberOfPages } = book

        const percentBookReaded = Number(
            ((readedPages / numberOfPages) * 100).toFixed(2),
        )

        response.json({
            total_lido: readedPages,
            total_paginas: numberOfPages,
            porcentagem_lida: percentBookReaded,
            message: `Você leu ${readedPages} páginas de ${numberOfPages}. Seu progresso no livro é de ${percentBookReaded}%.`,
        })
    }

    async getStats(request: Request, response: Response) {
        const { id: userId } = request.user

        const book = await prisma.book.findMany({
            where: {
                user_id: userId,
            },
        })

        if (!book) {
            throw new AppError(
                'Não foi possível localizar livros no seu cadastro',
                404,
            )
        }

        const quantityBooks = book.length

        const totalBooksEnded = book.filter((book) => {
            return book.readedPages >= book.numberOfPages
        }).length

        const percentBooksEnded = Number(
            ((totalBooksEnded / quantityBooks) * 100).toFixed(2),
        )

        response.json({ quantityBooks, totalBooksEnded, percentBooksEnded })
    }
}
