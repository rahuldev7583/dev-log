/*
  Warnings:

  - You are about to drop the column `session_end` on the `VsCodeEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VsCodeEvent" DROP COLUMN "session_end",
ADD COLUMN     "session_id" TEXT NOT NULL DEFAULT '';
