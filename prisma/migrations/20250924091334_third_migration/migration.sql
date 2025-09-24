/*
  Warnings:

  - You are about to drop the column `userId` on the `category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_userId_fkey`;

-- DropIndex
DROP INDEX `Category_name_userId_key` ON `category`;

-- DropIndex
DROP INDEX `Category_userId_fkey` ON `category`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `userId`;

-- CreateIndex
CREATE UNIQUE INDEX `Category_name_key` ON `Category`(`name`);
