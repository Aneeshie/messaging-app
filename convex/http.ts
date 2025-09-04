import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";

const validatePayload = async (request: Request): Promise<WebhookEvent | undefined>{
  const payload = await request.text()
}

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload
})


const http = httpRouter();


http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: handleClerkWebhook
})

export default http;

