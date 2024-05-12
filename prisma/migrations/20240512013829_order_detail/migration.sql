/*
  Warnings:

  - You are about to drop the column `queantity` on the `OrderDetail` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderDetail" DROP COLUMN "queantity",
ADD COLUMN     "quantity" INTEGER NOT NULL;
