/*
  Warnings:

  - Made the column `label` on table `TicketInventory` required. This step will fail if there are existing NULL values in that column.

*/
-- Update existing NULL values with appropriate labels
UPDATE "TicketInventory" SET "label" = 'VIP' WHERE "tier" = 'VIP' AND "label" IS NULL;
UPDATE "TicketInventory" SET "label" = 'Front Row' WHERE "tier" = 'FRONT_ROW' AND "label" IS NULL;
UPDATE "TicketInventory" SET "label" = 'General Admission (GA)' WHERE "tier" = 'GA' AND "label" IS NULL;

-- AlterTable
ALTER TABLE "TicketInventory" ALTER COLUMN "label" SET NOT NULL;
