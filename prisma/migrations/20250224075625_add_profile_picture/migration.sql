/*
  Warnings:

  - You are about to alter the column `profilePicture` on the `user` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `profilePicture` VARCHAR(191) NULL;
