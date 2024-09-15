import type { Request, RequestHandler, Response } from "express"
import { inviteService } from "./inviteService"
import { handleSuccessResponse, handleErrorResponse } from '@/common/utils/httpHandlers'
import { generateApiKey, generateUUID } from '@/common/utils/random'

export class InviteController {
    queryInvites: RequestHandler = async (req: Request, res: Response) => {
        const { communityId } = req.query

        return inviteService
            .queryInvites(
                { communityId: communityId as string },
                (req.query.include || {}) as Record<string, string>,
                (req.query.paging || {}) as Record<string, string>
            )
            .then((invites) => handleSuccessResponse({ invites }, res))
            .catch((error) => handleErrorResponse(error, res))
    }

    createInvite: RequestHandler = async (req: Request, res: Response) => {
        const { code, communityId } = req.body

        return inviteService
            .createInvite(req.userId!, {
                communityId,
                code: code || generateApiKey()
            })
            .then((invite) => handleSuccessResponse({ invite }, res))
            .catch((error) => handleErrorResponse(error, res))
    }

    acceptInvite: RequestHandler = async (req: Request, res: Response) => {
        const { inviteCode } = req.body

        return inviteService
            .acceptInvite(inviteCode, req.userId!)
            .then((invite) => handleSuccessResponse({ invite }, res))
            .catch((error) => handleErrorResponse(error, res))
    }
}

export const inviteController = new InviteController()
