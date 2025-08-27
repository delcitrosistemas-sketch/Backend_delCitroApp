/*
  Warnings:

  - A unique constraint covering the columns `[usuario]` on the table `USUARIOS` will be added. If there are existing duplicate values, this will fail.
  - Made the column `hash` on table `USUARIOS` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."USUARIOS" ALTER COLUMN "hash" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "USUARIOS_usuario_key" ON "public"."USUARIOS"("usuario");
