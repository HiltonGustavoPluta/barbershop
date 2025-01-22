/*
  Warnings:

  - You are about to drop the column `descriptopm` on the `Service` table. All the data in the column will be lost.
  - Added the required column `description` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "descriptopm",
ADD COLUMN     "description" TEXT NOT NULL;
