import type { ServiceResponse } from "@/common/models/serviceResponse"
import { CustomError, CustomErrorCode } from "@/common/utils/errors"
import dbClient, { prismaExclude } from "@/db"
import { type Prisma } from "@prisma/client"
import bcrypt from "bcrypt"
import { StatusCodes } from "http-status-codes"
import type { LoginUserDataType } from "./userRequestValidation"
import { QueryPaging } from '@/common/utils/commonTypes'
import { env } from '@/common/utils/envConfig'
import { logger } from '@/server'

// Omit the password and twoFactorSecret fields from the User type
const userOmitSecrets = prismaExclude("User", ["password", "twoFactorSecret", "resetPasswordToken", "phoneNumber2FACode"])
export type UserWithoutSecrets = Prisma.UserGetPayload<{
  select: typeof userOmitSecrets
}>

export class UserService {
  // Retrieves all users from the database
  async queryAllUsers(
    where?: Prisma.UserWhereInput,
    include?: Prisma.UserInclude,
    paging?: QueryPaging
  ): Promise<{
    users: UserWithoutSecrets[]
    total: number
  }> {
    const [users, total] = await dbClient.$transaction([
      dbClient.user.findMany({
        where,
        include,
        skip: paging?.skip || 0,
        take: paging?.take || 100,
      }),
      dbClient.user.count({ where })
    ])

    return {
      users,
      total,
    }
  }

  // Retrieves a single user by their ID
  async findById(id: string): Promise<UserWithoutSecrets> {
    const user = await dbClient.user.findFirst({ where: { id } })

    if (!user) {
      throw new CustomError("User not found", CustomErrorCode.USER_NOT_FOUND, {}, StatusCodes.NOT_FOUND)
    }

    return user
  }

  // Creates a single user
  async createUser(data: Prisma.UserUncheckedCreateInput): Promise<UserWithoutSecrets> {
    const userFound = await dbClient.user.findFirst({ where: { email: data.email } })

    if (userFound) {
      throw new CustomError("Email exists", CustomErrorCode.EMAIL_EXISTS, {}, StatusCodes.BAD_REQUEST)
    }

    const newUserData = {
      ...data,
      password: await bcrypt.hash(data.password, 10),
    }
    const newUser = await dbClient.user.create({ data: newUserData })

    return newUser
  }

  // Check user credentials and return the user ID
  async verifyLogin(data: LoginUserDataType): Promise<{ userId: string, role?: string }> {
    const user = await dbClient.user.findFirst({
      where: { email: data.email },
      select: {
        id: true,
        password: true,
        is2FAEnabled: true,
        twoFactorSecret: true,
        role: true,
      },
    })

    if (!user) {
      throw new CustomError("Invalid credentials", CustomErrorCode.INVALID_CREDENTIALS, {}, StatusCodes.UNAUTHORIZED)
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) {
      throw new CustomError("Invalid credentials", CustomErrorCode.INVALID_CREDENTIALS, {}, StatusCodes.UNAUTHORIZED)
    }

    if (user.is2FAEnabled && !data.twoFactorCode) {
      // TODO: Implement 2FA verification here
      throw new Error("2FA not implemented")
    }

    return { userId: user.id, role: user.role }
  }

  async forgotPassword(email: string): Promise<ServiceResponse<null>> {
    throw new Error("Not implemented")
  }

  async resetPassword(token: string, password: string): Promise<ServiceResponse<null>> {
    throw new Error("Not implemented")
  }

  async updatePassword(oldPassword: string, newPassword: string): Promise<ServiceResponse<null>> {
    throw new Error("Not implemented")
  }

  /**
   * Update a user's information
   * @param userId - The ID of the user to update
   * @param data - The data to update the user with
   * @returns The updated user
   */
  async updateUser(userId: string, data: Prisma.UserUncheckedUpdateInput): Promise<UserWithoutSecrets> {
    const user = await dbClient.user.update({
      where: { id: userId },
      data,
    })

    return user
  }

  /**
   * Request a verification code for a phone number
   * @param userId - The ID of the user to request a verification code for
   * @returns True if the verification code was sent, false otherwise
   */
  async requestVerifyPhoneNumber(userId: string): Promise<boolean> {
    const user = await dbClient.user.findFirst({
      where: { id: userId },
    })

    if (!user) {
      throw new CustomError("User not found", CustomErrorCode.USER_NOT_FOUND)
    }

    // TODO: send SMS with code to user here
    await dbClient.user.update({
      where: { id: userId },
      data: {
        phoneNumber2FACode: env.SMS_VERIFY_OVERRIDE || Math.floor(10000 + Math.random() * 90000).toString(),
      },
    })

    return true
  }

  /**
   * Verify a phone number
   * @param userId - The ID of the user to verify
   * @param phoneNumber - The phone number to verify
   * @param code - The verification code
   * @returns True if the phone number is verified, false otherwise
   */
  async verifyPhoneNumber(userId: string, phoneNumber: string, code: string): Promise<boolean> {
    const user = await dbClient.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        phoneNumber2FACode: true,
        phoneNumber: true,
      },
    })

    logger.info(`user: ${JSON.stringify(user, null, 2)}`)
    logger.info(`code: ${code}`)

    if (!user) {
      throw new CustomError("User not found", CustomErrorCode.USER_NOT_FOUND)
    }

    if (user.phoneNumber2FACode !== code) {
      throw new CustomError("Invalid phone number 2FA code", CustomErrorCode.INVALID_PHONE_NUMBER_CODE)
    }

    if (user.phoneNumber !== phoneNumber) {
      throw new CustomError("Invalid phone number", CustomErrorCode.INVALID_PHONE_NUMBER)
    }

    await dbClient.user.update({
      where: { id: user.id },
      data: {
        isPhoneNumberVerified: true,
        phoneNumber2FACode: null,
      },
    })

    return true
  }

  async myInfo(userId: string, include?: Prisma.UserInclude): Promise<UserWithoutSecrets | null> {
    return dbClient.user.findFirst({
      where: { id: userId },
      include,
    })
  }
}

export const userService = new UserService()
