/*
  Warnings:

  - Added the required column `detalles_id` to the `EMPLEADOS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."EMPLEADOS" ADD COLUMN     "detalles_id" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Activo';

-- CreateTable
CREATE TABLE "public"."DETALLES_EMPLEADO" (
    "id" SERIAL NOT NULL,
    "incidencia_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DETALLES_EMPLEADO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."INCIDENCIA" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "INCIDENCIA_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EMPLEADOS" ADD CONSTRAINT "EMPLEADOS_detalles_id_fkey" FOREIGN KEY ("detalles_id") REFERENCES "public"."DETALLES_EMPLEADO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DETALLES_EMPLEADO" ADD CONSTRAINT "DETALLES_EMPLEADO_incidencia_id_fkey" FOREIGN KEY ("incidencia_id") REFERENCES "public"."INCIDENCIA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
