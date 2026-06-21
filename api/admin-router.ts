import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { volunteers, contactRequests, chatLogs } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export const adminRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();

    const [volunteerCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(volunteers);

    const [contactCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactRequests);

    const [pendingCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactRequests)
      .where(eq(contactRequests.status, "pending"));

    const [sessionCount] = await db
      .select({ count: sql<number>`count(distinct ${chatLogs.sessionId})` })
      .from(chatLogs);

    return {
      totalVolunteers: volunteerCount.count,
      totalContacts: contactCount.count,
      totalChatSessions: sessionCount.count,
      pendingContacts: pendingCount.count,
    };
  }),
});
