import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import { CreateManagedUserSchema, CreateUserSchema, GetUserSchema, LoginUserSchema, MeQuerySchema, UpdateUserSchema } from "@/api/user/userRequestValidation"
import verifyJWT, { verifyJWTAndRole } from "@/common/middleware/verifyJWT"
import { validateRequest } from "@/common/utils/httpHandlers"
import { UserSchema } from "@zodSchema/index"
import { userController } from "./userController"
import { Role } from '@prisma/client'

export const userRegistry = new OpenAPIRegistry()
export const userRouter: Router = express.Router()

userRegistry.register("User", UserSchema)

// List all users
userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
})

userRouter.get("/", verifyJWTAndRole([Role.ADMIN]), userController.queryUsers)

// Get a user's own information
userRegistry.registerPath({
  method: "get",
  path: "/users/me",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
})

userRouter.get("/me", verifyJWT, validateRequest(MeQuerySchema), userController.myInfo)

// Get a user by ID
userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
})

userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser)

// Create a new user
userRegistry.registerPath({
  method: "post",
  path: "/users",
  tags: ["User"],
  request: {
    body: {
      description: 'object containing user information',
      content: {
        'application/json': {
          schema: CreateUserSchema.shape.body,
        },
      },
      required: true,
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
})

userRouter.post("/", validateRequest(CreateUserSchema), userController.register)

// Set the user's phone number
userRegistry.registerPath({
  method: "put",
  path: "/users",
  tags: ["User"],
  request: {
    body: {
      description: 'object containing user information',
      content: {
        'application/json': {
          schema: UpdateUserSchema.shape.body,
        },
      },
      required: true,
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
})

userRouter.put("/", validateRequest(UpdateUserSchema), userController.updateUser)

// Get a managed user by ID
userRegistry.registerPath({
  method: "post",
  path: "/users/managed",
  tags: ["User"],
  request: {
    body: {
      description: 'object containing managed user information',
      content: {
        'application/json': {
          schema: CreateManagedUserSchema.shape.body,
        },
      },
      required: true,
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
})

userRouter.post("/managed", verifyJWTAndRole([Role.ADMIN]), validateRequest(CreateManagedUserSchema), userController.createManagedUser)

// Login a user
userRegistry.registerPath({
  method: "post",
  path: "/users/login",
  tags: ["User"],
  request: {
    body: {
      description: 'object containing user login information',
      content: {
        'application/json': {
          schema: LoginUserSchema.shape.body,
        },
      },
      required: true,
    }
  },
  responses: createApiResponse(UserSchema, "Success"),
})

userRouter.post("/login", validateRequest(LoginUserSchema), userController.login)
