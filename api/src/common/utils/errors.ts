export enum CustomErrorCode {
  UNKNOWN = 0,
  // general errors
  EMAIL_EXISTS = 101,
  USER_NOT_FOUND = 102,
  INVALID_CREDENTIALS = 103,
  INVALID_REQUEST_DATA = 104,
  INVALID_TOKEN = 105,
  INVALID_COMMUNITY = 106,
  INVALID_ACCESS_CONTROL = 107,
}

export class CustomError extends Error {
  message: string
  data?: unknown
  statusCode?: number
  code: CustomErrorCode

  constructor(message: string, code: CustomErrorCode, data: unknown = {}, statusCode = 500) {
    super(message)
    this.message = message
    this.code = code
    this.data = data
    this.statusCode = statusCode
  }

  static unknown(err: Error, data: unknown = {}): CustomError {
    return new CustomError(err.message, CustomErrorCode.UNKNOWN, data, 500)
  }
}
