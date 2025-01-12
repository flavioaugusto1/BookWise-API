import { env } from '@/env'

export const authConfig = {
    jwt: {
        secret: env.SECRET_JWT,
        expiresIn: '1d',
    },
}
