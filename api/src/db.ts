import { Prisma, PrismaClient } from "@prisma/client"
import { env } from "./common/utils/envConfig"
import userModelExtension from "./common/models/userModelExtension"
import { logger } from './server'
import transactionModelExtension from './common/models/transactionModelExtension'

const client = new PrismaClient({
  omit: {
    user: {
      password: true,
      twoFactorSecret: true,
      resetPasswordToken: true,
    },
  },
  datasourceUrl: env.DATABASE_URL,
  log: ['query'],
}).$extends({
  model: {
    user: userModelExtension,
    transaction: transactionModelExtension,
  },
})

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never
type Entity = A<keyof typeof Prisma>
type Keys<T extends Entity> = Extract<keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>], string>

export function prismaExclude<T extends Entity, K extends Keys<T>>(type: T, omit: K[]) {
  type Key = Exclude<Keys<T>, K>
  type TMap = Record<Key, true>
  const result: TMap = {} as TMap
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true
    }
  }
  return result
}

export default client
