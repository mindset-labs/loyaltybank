import { ApiKey } from '@prisma/client'
import dbClient from '@/db'
import { generateApiKey, generateApiSecret } from '@/common/utils/random'

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
}

export const apiKeyService = new ApiKeyService()
