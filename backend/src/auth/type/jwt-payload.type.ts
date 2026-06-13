import { Request } from 'express'

export interface JwtUser {
    userId: string
    role: string
}

export interface RequestWithUser extends Request {
    user: JwtUser
}