import { pgTable, text, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadsTable = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  companyName: text("company_name").notNull(),
  roleType: text("role_type").notNull(),
  startupIntent: jsonb("startup_intent").notNull().$type<string[]>(),
  servicesOffered: jsonb("services_offered").notNull().$type<string[]>(),
  servicesNeeded: jsonb("services_needed").notNull().$type<string[]>(),
  message: text("message"),
  source: text("source").notNull().default("marketing_site"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
