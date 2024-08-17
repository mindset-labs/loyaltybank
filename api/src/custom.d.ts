import { UserWithoutSecrets } from './api/user/userService'
import { type ApiKey } from '@prisma/client'

declare global {
  namespace Express {
    export interface Request {
      userId?: string
      user?: UserWithoutSecrets
      tenantId?: string
      apiKey?: ApiKey
    }
  }
}
