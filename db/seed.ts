import { getDb } from "../api/queries/connection";
import { events, type InsertEvent } from "./schema";

const seedEvents: InsertEvent[] = [
  {
    title: "Community Health Camp",
    description:
      "Free health checkups and medical consultations for underprivileged communities.",
    date: new Date("2025-07-15T09:00:00+05:30"),
    location: "Kanpur, Uttar Pradesh",
    type: "past",
    registrationLink: "https://nayepankh.com/events/health-camp",
  },
  {
    title: "Education Drive for Children",
    description:
      "Distribution of educational supplies with interactive learning and career counselling sessions.",
    date: new Date("2025-07-22T10:00:00+05:30"),
    location: "Ghaziabad, Uttar Pradesh",
    type: "past",
    registrationLink: "https://nayepankh.com/events/education-drive",
  },
  {
    title: "Food Distribution Drive",
    description:
      "Monthly food distribution providing nutritious meals and ration kits to families in need.",
    date: new Date("2025-08-01T08:00:00+05:30"),
    location: "Kanpur & Ghaziabad",
    type: "past",
  },
];

async function seed() {
  const db = getDb();
  const existing = await db.select({ id: events.id }).from(events).limit(1);

  if (existing.length === 0) {
    await db.insert(events).values(seedEvents);
    console.log(`Seeded ${seedEvents.length} events.`);
  } else {
    console.log("Seed skipped: events already exist.");
  }

  process.exit(0);
}

seed().catch((error: unknown) => {
  console.error("Database seed failed:", error);
  process.exit(1);
});
