import type { Request, RequestHandler, Response } from "express"
import { apiKeyService } from "./apiKeyService"
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'

export class ApiKeyController {
    getAllApiKeys: RequestHandler = async (req: Request, res: Response) => {
        return apiKeyService
            .getAllApiKeys(req.userId!)
            .then((apiKeys) => handleSuccessResponse({ apiKeys }, res))
            .catch((error) => handleErrorResponse(error, res))
    };

    createApiKey: RequestHandler = async (req: Request, res: Response) => {
        return apiKeyService
            .createApiKey(req.userId!)
            .then(({ apiKey, secretPlainText }) => handleSuccessResponse({ apiKey, secretPlainText }, res))
            .catch((error) => handleErrorResponse(error, res))
    };

    removeApiKey: RequestHandler = async (req: Request, res: Response) => {
        return apiKeyService
            .removeApiKey(req.userId!, req.params.apiKeyId)
            .then(() => handleSuccessResponse({}, res))
            .catch((error) => handleErrorResponse(error, res))
    };
}

export const apiKeyController = new ApiKeyController()
