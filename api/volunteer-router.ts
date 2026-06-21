import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { volunteers } from "@db/schema";
import { desc } from "drizzle-orm";

export const volunteerRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(2).max(255),
        email: z.string().email(),
        phone: z.string().min(10).max(20),
        city: z.string().min(1).max(100),
        interests: z.array(z.string()).min(1),
        availability: z.enum(["weekdays", "weekends", "flexible"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(volunteers).values({
        name: input.name,
        email: input.email,
        phone: input.phone,
        city: input.city,
        interests: input.interests,
        availability: input.availability,
      });
      return { success: true, id: Number((result as unknown as { insertId: number }).insertId) };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(volunteers).orderBy(desc(volunteers.createdAt));
  }),
});
