import { authRouter } from "./auth-router";
import { chatRouter } from "./chat-router";
import { volunteerRouter } from "./volunteer-router";
import { contactRouter } from "./contact-router";
import { eventRouter } from "./event-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  chat: chatRouter,
  volunteer: volunteerRouter,
  contact: contactRouter,
  event: eventRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
