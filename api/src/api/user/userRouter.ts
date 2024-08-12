import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateUserSchema, GetUserSchema, LoginUserSchema } from "@/api/user/userRequestValidation";
import verifyJWT from "@/common/middleware/verifyJWT";
import { validateRequest } from "@/common/utils/httpHandlers";
import { UserSchema } from "@zodSchema/index";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

// List all users
userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/", verifyJWT, userController.getUsers);

// Get a user's own information
userRegistry.registerPath({
  method: "get",
  path: "/users/me",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/me", verifyJWT, userController.myInfo);

// Get a user by ID
userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);

// Create a new user
userRegistry.registerPath({
  method: "post",
  path: "/users",
  tags: ["User"],
  request: { params: CreateUserSchema.shape.body },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.post("/", validateRequest(CreateUserSchema), userController.register);

// Login a user
userRegistry.registerPath({
  method: "post",
  path: "/users/login",
  tags: ["User"],
  request: { params: LoginUserSchema.shape.body },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.post("/login", validateRequest(LoginUserSchema), userController.login);
