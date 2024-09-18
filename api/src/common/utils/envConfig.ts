import yenv from 'yenv'
import { cleanEnv, host, num, port, str, testOnly, url } from "envalid"

const envValues = yenv('env.yaml')

export const env = cleanEnv(envValues, {
  NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test", "docker"] }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  JWT_AUTH_SECRET: str({ devDefault: testOnly("test") }),
  DATABASE_URL: url(),
  DEFAULT_BALANCE: num(),
  REDIS_URL: url(),
  LOG_LEVEL: str({ default: 'debug' }),
  SMS_VERIFY_OVERRIDE: str({ default: '00000' }),
})
