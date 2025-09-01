/*
  Warnings:

  - You are about to drop the `INCIDENCIA` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."DETALLES_EMPLEADO" DROP CONSTRAINT "DETALLES_EMPLEADO_incidencia_id_fkey";

-- DropTable
DROP TABLE "public"."INCIDENCIA";

-- CreateTable
CREATE TABLE "public"."INCIDENCIAS" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "INCIDENCIAS_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DETALLES_EMPLEADO" ADD CONSTRAINT "DETALLES_EMPLEADO_incidencia_id_fkey" FOREIGN KEY ("incidencia_id") REFERENCES "public"."INCIDENCIAS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
