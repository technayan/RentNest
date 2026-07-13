/*
  Warnings:

  - You are about to drop the column `transaction_id` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripe_session_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripe_session_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "payments_transaction_id_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "transaction_id",
ADD COLUMN     "stripe_session_id" TEXT NOT NULL,
ALTER COLUMN "method" SET DEFAULT 'Card',
ALTER COLUMN "provider" SET DEFAULT 'Stripe';

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripe_session_id_key" ON "payments"("stripe_session_id");
