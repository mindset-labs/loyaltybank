import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"

import { commonValidations } from "@/common/utils/commonValidation"
import { UserIncludeSchema } from '@zodSchema/index'
// import { Prisma } from '@prisma/client'

extendZodWithOpenApi(z)

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
})

// Input and Type validation for user creation
export const CreateUserSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  }),
})

// Input and Type validation for creating a managed user
export const CreateManagedUserSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
})

// Input and Type validation for user login
export const LoginUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    twoFactorCode: z.string().optional(),
  }),
})
export type LoginUserDataType = z.infer<typeof LoginUserSchema.shape.body>

// Query parameter validation for /me endpoint
export const MeQuerySchema = z.object({
  query: z.object({
    include: UserIncludeSchema.optional(),
  }),
})
