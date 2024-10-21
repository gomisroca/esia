/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Exhibition` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Exhibition" ALTER COLUMN "image" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Exhibition_name_key" ON "Exhibition"("name");
