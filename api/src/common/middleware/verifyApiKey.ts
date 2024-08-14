import { env } from "@/common/utils/envConfig"
import { CustomError, CustomErrorCode } from "@/common/utils/errors"
import { handleErrorResponse } from "@/common/utils/httpHandlers"
import db from "@/db"
import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import bcrypt from 'bcrypt'

const rejectApiKey = (res: Response) => {
    return handleErrorResponse(
        new CustomError("Invalid API Key", CustomErrorCode.INVALID_API_KEY, {
            message: "Invalid or missing API Key",
        }),
        res,
        StatusCodes.UNAUTHORIZED,
    )
}

export default async (req: Request, res: Response, next: NextFunction) => {
    // Check if the request has a valid token
    const apiKey = req.headers['x-api-key']
    if (!apiKey) {
        return rejectApiKey(res)
    }

    // Verify the API Key
    const key = await db.apiKey.findFirst({
        where: { key: apiKey as string }
    })

    if (!key) {
        return rejectApiKey(res)
    }

    bcrypt.compare(apiKey as string, key.secret, (err) => {
        if (err) {
            return rejectApiKey(res)
        }

        req.apiKey = key
        next()
    })
}
