import type { NextFunction, Request, RequestHandler, Response, } from "express"
import { verify } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const AUTH_SECRET = process.env.AUTH_SECRET

export const authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        res.status(401).json({ message: "Unauthorized access." })
        return
    }

    try {
        const { id } = verify(token, AUTH_SECRET)

        req.user = {
            id: id,
        }
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid token." })
    }
}
