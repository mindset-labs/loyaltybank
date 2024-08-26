import { CustomError, CustomErrorCode } from "@/common/utils/errors"
import { handleErrorResponse } from "@/common/utils/httpHandlers"
import db from "@/db"
import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import bcrypt from 'bcrypt'
import { logger } from '@/server'

const rejectApiKey = (res: Response, err?: CustomError) => {
    const error = err || new CustomError("Invalid API Key", CustomErrorCode.INVALID_API_KEY)
    return handleErrorResponse(error, res, StatusCodes.UNAUTHORIZED)
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key']

    // If not API Key is provided, continue
    if (!apiKey) {
        return next()
    }

    const apiKeySplit = (apiKey as string).split(':')

    // Verify the API Key
    const key = await db.apiKey.findFirst({
        where: { key: apiKeySplit[0] }
    })

    if (!key) {
        return rejectApiKey(res)
    }

    bcrypt.compare(apiKeySplit[1], key.secret, async (err) => {
        if (err) {
            return rejectApiKey(res)
        }

        req.apiKey = key

        // If the API key is valid and a user ID is provided, set the user ID in the request
        // as a way to authenticate on behalf of a user, otherwise, assume the key owner is the user
        if (req.headers['x-user-id']) {
            req.userId = req.headers['x-user-id'] as string
        } else {
            req.userId = key.createdById
        }

        const user = await db.user.findFirst({ where: { id: req.userId } })

        if (!user) {
            return rejectApiKey(res, new CustomError("Invalid user for API Key", CustomErrorCode.INVALID_USER_FOR_API_KEY))
        }

        req.user = user
        next()
    })
}
