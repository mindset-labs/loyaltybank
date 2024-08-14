import { ApiKey } from '@prisma/client'

declare namespace Express {
  export interface Request {
    userId?: string
    user?: UserWithoutSecrets
    tenantId?: string
    apiKey?: ApiKey
  }
}
