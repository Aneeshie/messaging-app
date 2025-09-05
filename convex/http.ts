import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const http = httpRouter();

const validateRequest = async (req: Request) : Promise<WebhookEvent | undefined> => {
    const svixHeaders = { 
     svix_id: req.headers.get("svix-id")!,
     svix_timestamp: req.headers.get("svix-timestamp")!,
     svix_signature: req.headers.get("svix-signature")!,
    }
    
    const body = await req.text();
    
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

    let event;

     try {
        event = wh.verify(body, svixHeaders) as WebhookEvent
        return event;
     } catch(error){
        console.error("Could not verify webhook");
        return;
     }

}

export const handleClerkWebhook = httpAction( async (ctx, req) => {

    const event = await validateRequest(req);

    if(!event){
        return new Response('Error occured', { status: 400 })
    }

    switch (event.type) {
        case 'user.created':
          const user = await ctx.runQuery(internal.user.getUser, { clerkId: event.data.id });
          if (user) {
            console.log(`updating user ${event.data.id} with ${event.data}`);
          }
        case 'user.updated':
          await ctx.runMutation(internal.user.createUser, {
            username: `${event.data.first_name} ${event.data.last_name}`,
            imageUrl: event.data.image_url,
            clerkId: event.data.id,
            email: event.data.email_addresses[0].email_address
          });
        default: {
          console.log('ignored Clerk webhook event', event.type);
        }
      }
    return new Response(null, {status: 200});
})

http.route({
    path: '/clerk-webhook',
    method: 'POST',
    handler: handleClerkWebhook,
})

export default http;