export enum CustomErrorCode {
  UNKNOWN = 0,
  // general errors
  EMAIL_EXISTS = 101,
  USER_NOT_FOUND = 102,
  INVALID_CREDENTIALS = 103,
  INVALID_REQUEST_DATA = 104,
  INVALID_TOKEN = 105,
  INVALID_ACCESS_CONTROL = 106,
  INVALID_API_KEY = 107,
  DATABASE_ERROR = 108,
  INVALID_QUERY = 109,
  INVALID_USER_FOR_API_KEY = 110,
  USER_NOT_MANAGED = 111,

  // community errors
  INVALID_COMMUNITY = 200,
  COMMUNITY_NOT_ACTIVE = 201,
  COMMUNITY_NOT_PUBLIC = 202,
  USER_ALREADY_MEMBER = 203,
  INVALID_COMMUNITY_ACCESS = 204,
  INVALID_WALLET_FOR_COMMUNITY = 205,

  // payment errors
  INVALID_WALLET_ID = 301,
  INSUFFICIENT_FUNDS = 302,
  INVALID_WALLET_COMMUNITY = 303,
  INVALID_WALLET_TOKEN = 304,
  WALLET_CANNOT_SEND_TO_ITSELF = 305,
  INVALID_OR_PAID_PAYMENT_TRANSACTION = 306,

  // wallet errors
  INVALID_RECIPIENT_ID = 401,
  WALLET_ALREADY_SHARED_WITH_USER = 402,
  QR_CODE_GENERATION_FAILED = 403,

  // event errors
  UNKNOWN_EVENT = 501,
  MUST_BE_EVENT_OWNER_OR_COMMUNITY_ADMIN = 502,

  // achievement errors
  INVALID_ACHIEVEMENT = 601,
  INVALID_REWARD_CLAIM = 602,
  INVALID_ACHIEVEMENT_REWARD = 603,

  // invite errors
  INVITE_NOT_FOUND = 701,
  INVITE_NOT_AVAILABLE = 702,
  INVITE_MAX_USES_REACHED = 703,
  INVALID_INVITE_OR_USER_NOT_ADMIN = 704,
}

export class CustomError extends Error {
  message: string
  data: unknown
  meta?: unknown // for prisma errors
  statusCode?: number
  code: CustomErrorCode

  constructor(message: string, code: CustomErrorCode, data: unknown = {}, statusCode = 500) {
    super(message)
    this.name = 'CustomError'
    this.message = message
    this.code = code
    this.data = data
    this.statusCode = statusCode
  }

  static unknown(err: Error, data: unknown = {}): CustomError {
    return new CustomError(err.message, CustomErrorCode.UNKNOWN, data, 500)
  }
}
