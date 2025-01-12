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
            numberOfPages: z.number().int(),
        })

        const { title, author, gender, year, numberOfPages } =
            requestBodySchema.parse(request.body)

        const { id: user_id } = request.user

        const book = await prisma.book.create({
            data: {
                title,
                author,
                gender,
                year,
                numberOfPages,
                user_id,
            },
        })

        response.status(201).json({ book })
    }

    async index(request: Request, response: Response) {
        const { id: user_id } = request.user

        const books = await prisma.book.findMany({
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
