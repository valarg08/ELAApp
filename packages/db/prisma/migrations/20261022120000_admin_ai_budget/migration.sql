-- Admin: a daily AI budget per organisation (estimated cost in US cents); null means no cap.
ALTER TABLE "Organization" ADD COLUMN "aiDailyBudgetCents" INTEGER;
