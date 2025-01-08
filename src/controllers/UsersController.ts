import { prisma } from '@/database/prisma'
import { AppError } from '@/utils/AppError'
import { hash } from 'bcrypt'
import { Request, Response } from 'express'
import z from 'zod'

export class UsersController {
    async create(request: Request, response: Response) {
        const requestBodySchema = z.object({
            name: z.string().min(1),
            email: z.string().email(),
            password: z.string(),
        })

        const { name, email, password } = requestBodySchema.parse(request.body)

        const userExists = await prisma.user.findFirst({
            where: {
                email,
            },
        })

        if (userExists) {
            throw new AppError('E-mail já está em uso.', 401)
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })

        const { password: _, ...userWihtoutPassowrd } = user

        response.status(201).json({ user: userWihtoutPassowrd })
    }
}
