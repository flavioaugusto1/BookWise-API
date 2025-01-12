/*
  Warnings:

  - You are about to drop the `genders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gender` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "genders" DROP CONSTRAINT "genders_book_id_fkey";

-- AlterTable
ALTER TABLE "books" ADD COLUMN     "gender" TEXT NOT NULL;

-- DropTable
DROP TABLE "genders";
