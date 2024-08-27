import { ApiKey } from '@prisma/client'
import dbClient from '@/db'
import { generateApiKey, generateApiSecret } from '@/common/utils/random'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'

export class ApiKeyService {
    async getAllApiKeys(userId: string): Promise<ApiKey[]> {
        const apiKeys = await dbClient.apiKey.findMany({
            where: {
                createdById: userId,
            },
        })

        return apiKeys
    }

    async createApiKey(userId: string): Promise<{ apiKey: ApiKey, secretPlainText: string }> {
        const { secretPlainText, secretHashed } = await generateApiSecret()

        const apiKey = await dbClient.apiKey.create({
            data: {
                createdById: userId,
                key: generateApiKey(),
                secret: secretHashed,
            },
        })

        return { apiKey, secretPlainText }
    }

    async removeApiKey(userId: string, apiKeyId: string): Promise<void> {
        // check if the user has the api key
        const apiKey = await dbClient.apiKey.findUnique({
            where: {
                id: apiKeyId,
                createdById: userId,
            },
        })

        if (!apiKey) {
            throw new CustomError('API Key not found or does not belong to the user', CustomErrorCode.INVALID_API_KEY)
        }

        await dbClient.apiKey.delete({
            where: {
                id: apiKeyId,
                createdById: userId,
            },
        })
    }
}

export const apiKeyService = new ApiKeyService()
