import yenv from 'yenv'
import { cleanEnv, host, num, port, str, testOnly } from "envalid"

const envValues = yenv('env.yaml')

export const env = cleanEnv(envValues, {
  NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test"] }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  JWT_AUTH_SECRET: str({ devDefault: testOnly("test") }),
  DATABASE_URL: str(),
  DEFAULT_BALANCE: num(),
})
