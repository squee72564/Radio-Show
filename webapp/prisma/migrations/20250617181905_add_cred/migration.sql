/*
  Warnings:

  - Added the required column `credential` to the `StreamSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StreamSchedule" ADD COLUMN     "credential" TEXT NOT NULL;
