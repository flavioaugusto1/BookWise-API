import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
    PORT: z.coerce.number().default(3333),
    SECRET_JWT: z.string(),
})

export const env = envSchema.parse(process.env)
