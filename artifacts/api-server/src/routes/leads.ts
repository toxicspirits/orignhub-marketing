import { Router } from "express";
import { db, leadsTable } from "@workspace/db";
import { SubmitLeadBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const leadsRouter = Router();

leadsRouter.post("/marketing/leads", async (req, res) => {
  const parsed = SubmitLeadBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ ok: false, error: "Invalid form submission." });
    return;
  }

  const {
    fullName,
    email,
    companyName,
    roleType,
    startupIntent,
    servicesOffered,
    servicesNeeded,
    message,
  } = parsed.data;

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existing = await db
      .select()
      .from(leadsTable)
      .where(eq(leadsTable.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(leadsTable)
        .set({
          fullName: fullName.trim(),
          companyName: companyName.trim(),
          roleType,
          startupIntent: startupIntent ?? [],
          servicesOffered: servicesOffered ?? [],
          servicesNeeded: servicesNeeded ?? [],
          message: message ?? null,
          updatedAt: new Date(),
        })
        .where(eq(leadsTable.email, normalizedEmail));
    } else {
      await db.insert(leadsTable).values({
        fullName: fullName.trim(),
        email: normalizedEmail,
        companyName: companyName.trim(),
        roleType,
        startupIntent: startupIntent ?? [],
        servicesOffered: servicesOffered ?? [],
        servicesNeeded: servicesNeeded ?? [],
        message: message ?? null,
        source: "marketing_site",
      });
    }

    req.log.info({ email: normalizedEmail }, "Lead captured");
    res.status(201).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to save lead");
    res.status(500).json({ ok: false, error: "Unable to save lead." });
  }
});

export default leadsRouter;
