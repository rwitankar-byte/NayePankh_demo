import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { chatLogs } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { env } from "./lib/env";

const NAYEPANKH_KNOWLEDGE = `You are the NayePankh Foundation AI Assistant. You help visitors with information about volunteering, internships, events, donations, and the organization's work.

ABOUT NAYEPANKH FOUNDATION:
- Founded in 2021 by Prashant Shukla (Founder & President)
- UP Government Registered NGO with 80G & 12A certification
- One of India's biggest student-led NGOs
- Operations in Kanpur, Ghaziabad, Lucknow, Delhi NCR, and various other cities
- Mission: Uplifting underprivileged people in hunger, sanitary, health, education, awareness, and rights
- Tagline: "It's that easy to bring a Smile on Their Faces"
- Quote: "If we all do something, then together there is no problem that we cannot solve!" - Prashant Shukla
- Email: contact@nayepankh.com
- Phone: +91-8318500748
- Website: https://nayepankh.com
- Social: Instagram (@nayepankhfoundation), LinkedIn (/company/nayepankh), YouTube (@nayepankhfoundation), Twitter (@nayepankh), Facebook (/nayepankhfoundation)

VOLUNTEER PROGRAMS:
- Education support for underprivileged children
- Health and sanitation camps
- Food distribution drives
- Women empowerment initiatives
- Skill development workshops
- Environmental awareness campaigns
- Anyone can volunteer - students, professionals, retirees
- No prior experience required for most roles
- To register: visit our website and fill the volunteer form

INTERNSHIP PROGRAMS:
- Open to students and recent graduates
- Fields: Content Writing, Social Media, Graphic Design, Web Development, Event Management, Field Operations, Research, HR, Marketing
- Duration: 1-3 months (flexible)
- Certificate provided upon completion
- Hands-on experience in NGO operations
- Location: Kanpur, Ghaziabad, Delhi NCR (remote options available for some roles)
- Application: Fill the form on our website or contact us directly

EVENTS:
- Regular community outreach programs
- Health checkup camps
- Educational workshops
- Food distribution drives
- Awareness campaigns
- Fundraising events
- Tree plantation drives
- Blood donation camps

DONATIONS:
- All donations tax-exempted under 80G of Indian Income Tax Act
- Online donation available through website (https://nayepankh.com/donate)
- Accepts money, skills, and time contributions
- Even small donations make a big impact

HOW TO GET INVOLVED:
- Register as a volunteer through our website
- Apply for internships
- Donate online
- Follow us on social media
- Attend our events
- Spread awareness about our cause

Respond warmly, concisely, and helpfully. Use a friendly, encouraging tone. If you cannot answer a question, politely say so and offer to collect their contact information for a team member to follow up. Keep responses under 150 words unless the question requires more detail. Format your responses with proper line breaks for readability.`;

export const chatRouter = createRouter({
  send: publicQuery
    .input(
      z.object({
        message: z.string().min(1).max(2000),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const sessionId = input.sessionId || crypto.randomUUID();
      const db = getDb();

      // Save user message
      await db.insert(chatLogs).values({
        sessionId,
        role: "user",
        message: input.message,
      });

      // Get conversation history (last 10 messages)
      const history = await db
        .select()
        .from(chatLogs)
        .where(eq(chatLogs.sessionId, sessionId))
        .orderBy(desc(chatLogs.createdAt))
        .limit(10);

      const messages = history.reverse().map((h) => ({
        role: h.role as "user" | "assistant",
        content: h.message,
      }));

      // Call OpenRouter API
      let answer: string;
      try {
        if (!env.openrouterApiKey || env.openrouterApiKey === "sk-or-v1-demo-key-replace-with-real-key") {
          answer = getFallbackResponse(input.message);
        } else {
          const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${env.openrouterApiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://nayepankh.com",
                "X-Title": "NayePankh AI Assistant",
              },
              body: JSON.stringify({
                model: "qwen/qwen-2.5-72b-instruct",
                messages: [
                  { role: "system", content: NAYEPANKH_KNOWLEDGE },
                  ...messages.slice(0, -1), // exclude the last user message (already in messages)
                  { role: "user", content: input.message },
                ],
                max_tokens: 500,
                temperature: 0.7,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
          }

          const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
          answer =
            data.choices?.[0]?.message?.content ||
            "I'm sorry, I couldn't process that. Please try again.";
        }
      } catch {
        answer = getFallbackResponse(input.message);
      }

      // Save AI response
      await db.insert(chatLogs).values({
        sessionId,
        role: "assistant",
        message: answer,
      });

      return { answer, sessionId };
    }),

  getHistory: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(chatLogs)
        .where(eq(chatLogs.sessionId, input.sessionId))
        .orderBy(chatLogs.createdAt);
    }),
});

function getFallbackResponse(message: string): string {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("volunteer") || lowerMsg.includes("join")) {
    return "Thank you for your interest in volunteering with NayePankh! Anyone can volunteer - students, professionals, or retirees. We have opportunities in education, health, food distribution, women empowerment, and more.\n\nTo register, please fill out our volunteer form on the website or contact us at:\n\n📧 contact@nayepankh.com\n📞 +91-8318500748";
  }

  if (lowerMsg.includes("internship") || lowerMsg.includes("intern")) {
    return "Our internship program is open to students and recent graduates! We offer roles in:\n\n• Content Writing\n• Social Media\n• Graphic Design\n• Web Development\n• Event Management\n• Field Operations\n• Research & HR\n\nDuration: 1-3 months (flexible)\nLocation: Kanpur, Ghaziabad, Delhi NCR (remote available)\n\nYou'll receive a certificate and hands-on NGO experience. Apply through our website!";
  }

  if (lowerMsg.includes("event") || lowerMsg.includes("program")) {
    return "We regularly organize:\n\n• Community outreach programs\n• Health checkup camps\n• Educational workshops\n• Food distribution drives\n• Awareness campaigns\n• Tree plantation drives\n• Blood donation camps\n\nFollow us on social media @nayepankhfoundation for upcoming events!";
  }

  if (lowerMsg.includes("donate") || lowerMsg.includes("donation")) {
    return 'Your donation can bring a smile to someone in need! \n\n• All donations are tax-exempted under 80G\n• You can donate online at https://nayepankh.com/donate\n• We accept money, skills, and time contributions\n• Even small donations make a big impact\n\n"If we all do something, then together there is no problem that we cannot solve!" - Prashant Shukla';
  }

  if (lowerMsg.includes("contact") || lowerMsg.includes("phone") || lowerMsg.includes("email")) {
    return "You can reach NayePankh Foundation at:\n\n📧 Email: contact@nayepankh.com\n📞 Phone: +91-8318500748\n🌐 Website: https://nayepankh.com\n\nSocial Media:\n• Instagram: @nayepankhfoundation\n• LinkedIn: /company/nayepankh\n• Twitter: @nayepankh\n• YouTube: @nayepankhfoundation";
  }

  if (lowerMsg.includes("about") || lowerMsg.includes("who") || lowerMsg.includes("what")) {
    return 'NayePankh Foundation is a UP Government Registered NGO founded in 2021 by Prashant Shukla. We are one of India\'s biggest student-led NGOs, operating in Kanpur, Ghaziabad, Delhi NCR, and beyond.\n\nOur mission is to uplift underprivileged communities through work in:\n• Hunger relief\n• Health & sanitation\n• Education\n• Women empowerment\n• Awareness & rights\n\nWe believe: "It\'s that easy to bring a Smile on Their Faces" ';
  }

  return "Thank you for reaching out! I'm here to help with questions about volunteering, internships, events, donations, or anything about NayePankh Foundation.\n\nWhat would you like to know? Feel free to ask, or you can contact our team directly at contact@nayepankh.com or +91-8318500748.";
}
