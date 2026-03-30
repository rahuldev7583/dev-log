/*
  Warnings:

  - A unique constraint covering the columns `[session_id]` on the table `VsCodeEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "VsCodeEvent" ALTER COLUMN "session_id" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "VsCodeEvent_session_id_key" ON "VsCodeEvent"("session_id");
