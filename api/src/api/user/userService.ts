import type { ServiceResponse } from "@/common/models/serviceResponse";
import { CustomError, CustomErrorCode } from "@/common/utils/errors";
import dbClient, { prismaExclude } from "@/db";
import { logger } from "@/server";
import type { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import type { CreateUserDataType, LoginUserDataType } from "./userRequestValidation";

// Omit the password and twoFactorSecret fields from the User type
const userOmitSecrets = prismaExclude("User", ["password", "twoFactorSecret"]);
type UserWithoutSecrets = Prisma.UserGetPayload<{
  select: typeof userOmitSecrets;
}>;

export class UserService {
  // Retrieves all users from the database
  async findAll(): Promise<UserWithoutSecrets[]> {
    try {
      return dbClient.user.findMany();
    } catch (err) {
      logger.error(`Error finding all users: $${(err as Error).message}`);
      throw CustomError.unknown(err as Error);
    }
  }

  // Retrieves a single user by their ID
  async findById(id: string): Promise<UserWithoutSecrets> {
    const user = await dbClient.user.findFirst({ where: { id } });

    if (!user) {
      throw new CustomError("User not found", CustomErrorCode.USER_NOT_FOUND, {}, StatusCodes.NOT_FOUND);
    }

    return user;
  }

  // Creates a single user
  async createUser(data: CreateUserDataType): Promise<UserWithoutSecrets> {
    const userFound = await dbClient.user.findFirst({ where: { email: data.email } });

    if (userFound) {
      throw new CustomError("Email exists", CustomErrorCode.EMAIL_EXISTS, {}, StatusCodes.BAD_REQUEST);
    }

    const newUserData = {
      ...data,
      password: await bcrypt.hash(data.password, 10),
    };
    const newUser = await dbClient.user.create({ data: newUserData });

    return newUser;
  }

  // Check user credentials and return the user ID
  async verifyLogin(data: LoginUserDataType): Promise<string> {
    const user = await dbClient.user.findFirst({
      where: { email: data.email },
      select: {
        id: true,
        password: true,
        is2FAEnabled: true,
        twoFactorSecret: true,
      },
    });

    if (!user) {
      throw new CustomError("Invalid credentials", CustomErrorCode.INVALID_CREDENTIALS, {}, StatusCodes.UNAUTHORIZED);
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw new CustomError("Invalid credentials", CustomErrorCode.INVALID_CREDENTIALS, {}, StatusCodes.UNAUTHORIZED);
    }

    if (user.is2FAEnabled && !data.twoFactorCode) {
      // TODO: Implement 2FA verification here
      throw new Error("2FA not implemented");
    }

    return user.id;
  }

  async forgotPassword(email: string): Promise<ServiceResponse<null>> {
    throw new Error("Not implemented");
  }

  async resetPassword(token: string, password: string): Promise<ServiceResponse<null>> {
    throw new Error("Not implemented");
  }

  async updatePassword(oldPassword: string, newPassword: string): Promise<ServiceResponse<null>> {
    throw new Error("Not implemented");
  }

  async updateMe(data: CreateUserDataType): Promise<ServiceResponse<null>> {
    throw new Error("Not implemented");
  }

  async myInfo(): Promise<ServiceResponse<null>> {
    throw new Error("Not implemented");
  }
}

export const userService = new UserService();
