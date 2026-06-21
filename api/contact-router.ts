import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contactRequests } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(2).max(255),
        email: z.string().email(),
        query: z.string().min(10).max(5000),
        source: z.enum(["contact_form", "ai_escalation"]).default("contact_form"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(contactRequests).values({
        name: input.name,
        email: input.email,
        query: input.query,
        source: input.source,
      });
      return { success: true, id: Number((result as unknown as { insertId: number }).insertId) };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(contactRequests)
      .orderBy(desc(contactRequests.createdAt));
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "reviewed", "resolved"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(contactRequests)
        .set({ status: input.status })
        .where(eq(contactRequests.id, input.id));
      return { success: true };
    }),
});
