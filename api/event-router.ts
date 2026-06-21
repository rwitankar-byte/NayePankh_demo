import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { events } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const eventRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          type: z.enum(["upcoming", "past", "all"]).default("all"),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const type = input?.type ?? "all";

      if (type === "all") {
        return db.select().from(events).orderBy(desc(events.date));
      }

      return db
        .select()
        .from(events)
        .where(eq(events.type, type))
        .orderBy(desc(events.date));
    }),
});
