declare namespace Express {
  export interface Request {
    userId?: string;
    user?: UserWithoutSecrets;
    tenantId?: string;
  }
}
