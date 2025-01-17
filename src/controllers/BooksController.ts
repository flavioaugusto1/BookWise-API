import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { Request, Response } from 'express'
import { z } from 'zod'

export class BooksController {
    async create(request: Request, response: Response) {
        const requestBodySchema = z.object({
            title: z.string(),
            author: z.string(),
            gender: z.string(),
            year: z.number().int(),
            readedPages: z.number().int().min(0),
            numberOfPages: z.number().int(),
        })

        const { title, author, gender, year, readedPages, numberOfPages } =
            requestBodySchema.parse(request.body)

        const { id: user_id } = request.user

        const book = await prisma.book.create({
            data: {
                title,
                author,
                gender,
                year,
                readedPages,
                numberOfPages,
                user_id,
            },
        })

        response.status(201).json({ book })
    }

    async index(request: Request, response: Response) {
        const requestQuerySchema = z.object({
            page: z.coerce.number().int().min(1).optional(),
        })

        const { page } = requestQuerySchema.parse(request.query)

        const { id: user_id } = request.user

        const skipItems = !page || page === 1 ? 0 : 5 * page - 5

        const books = await prisma.book.findMany({
            skip: skipItems,
            take: 5,
            where: {
                user_id,
            },
        })

        if (!books) {
            throw new AppError('Você não possui livros cadastrados', 404)
        }

        response.json({ books })
    }

    async show(request: Request, response: Response) {
        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = requestParamSchema.parse(request.params)

        const { id: user_id } = request.user

        const book = await prisma.book.findFirst({
            where: {
                id,
                user_id,
            },
            include: {
                Review: {
                    select: {
                        id: true,
                        grade: true,
                        user_id: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        })

        if (!book) {
            throw new AppError(
                'Não foi possível localizar o livro informado.',
                404,
            )
        }

        response.json({ book })
    }

    async update(request: Request, response: Response) {
        const requestBodySchema = z.object({
            title: z.string().optional(),
            author: z.string().optional(),
            gender: z.string().optional(),
            year: z.number().int().optional(),
            numberOfPages: z.number().int().min(1).optional(),
        })

        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = requestParamSchema.parse(request.params)

        const { title, author, gender, year, numberOfPages } =
            requestBodySchema.parse(request.body)

        const { id: user_id } = request.user

        const book = await prisma.book.findFirst({
            where: {
                id,
                user_id,
            },
        })

        if (!book) {
            throw new AppError(
                'Não foi possível localizar o livro informado.',
                404,
            )
        }

        await prisma.book.update({
            data: {
                title,
                author,
                gender,
                year,
                numberOfPages,
            },
            where: {
                id,
                user_id,
            },
        })

        response.json({ message: 'Livro atualizado com sucesso.' })
    }

    async delete(request: Request, response: Response) {
        const requestParamSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = requestParamSchema.parse(request.params)

        const { id: user_id } = request.user

        const book = await prisma.book.findFirst({
            where: {
                id,
                user_id,
            },
        })

        if (!book) {
            throw new AppError(
                'Não foi possível localizar o livro informado.',
                404,
            )
        }

        await prisma.book.delete({
            where: {
                id,
                user_id,
            },
        })

        response.json({ message: 'Livro excluído com sucesso.' })
    }
}
