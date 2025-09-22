/*
  Warnings:

  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fullname]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_username_key` ON `user`;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `receipt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `username`,
    ADD COLUMN `fullname` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_fullname_key` ON `User`(`fullname`);
