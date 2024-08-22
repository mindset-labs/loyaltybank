import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi"

import { healthCheckRegistry } from "@/api/healthCheck/healthCheckRouter"
import { userRegistry } from "@/api/user/userRouter"
import { walletRegistry } from "@/api/wallet/walletRouter"
import { transactionRegistry } from "@/api/transaction/transactionRouter"
import { communityRegistry } from "@/api/community/communityRouter"
import { achievementRegistry } from "@/api/achievement/achievementRouter"
import { eventRegistry } from "@/api/event/eventRouter"
import { paymentRegistry } from "@/api/payment/paymentRouter"
// import { membershipRegistry } from "@/api/membership/membershipRouter"

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    healthCheckRegistry,
    userRegistry,
    communityRegistry,
    walletRegistry,
    paymentRegistry,
    // transactionRegistry,
    achievementRegistry,
    eventRegistry,
  ])
  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  })
}
