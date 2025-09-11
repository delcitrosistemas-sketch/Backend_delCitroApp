/*
  Warnings:

  - You are about to drop the column `observaciones` on the `REGISTRO_DESCARGA_FRUTA_PARA_PROCESO` table. All the data in the column will be lost.
  - Added the required column `boleta` to the `REGISTRO_DESCARGA_FRUTA_PARA_PROCESO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destino` to the `REGISTRO_DESCARGA_FRUTA_PARA_PROCESO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detalles_id` to the `REGISTRO_DESCARGA_FRUTA_PARA_PROCESO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha` to the `REGISTRO_DESCARGA_FRUTA_PARA_PROCESO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proveedor_id` to the `REGISTRO_DESCARGA_FRUTA_PARA_PROCESO` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."REGISTRO_DESCARGA_FRUTA_PARA_PROCESO" DROP COLUMN "observaciones",
ADD COLUMN     "boleta" INTEGER NOT NULL,
ADD COLUMN     "destino" TEXT NOT NULL,
ADD COLUMN     "detalles_id" INTEGER NOT NULL,
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "proveedor_id" INTEGER NOT NULL,
ALTER COLUMN "folio" SET DATA TYPE TEXT,
ALTER COLUMN "inicio_descarga" DROP NOT NULL,
ALTER COLUMN "fin_descarga" DROP NOT NULL,
ALTER COLUMN "cant_progra_desca" DROP NOT NULL,
ALTER COLUMN "cant_real_desca" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."PROVEEDORES" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT,
    "empresa" TEXT NOT NULL,
    "direccion" TEXT,
    "estado" TEXT NOT NULL,
    "codigoPostal" TEXT,
    "pais" TEXT NOT NULL DEFAULT 'México',
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PROVEEDORES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DETALLES_REGISTRO_DESCARGA_FRUTA_PARA_PROCESO" (
    "id" SERIAL NOT NULL,
    "bins" INTEGER,
    "jaula" TEXT,
    "huerta" TEXT,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DETALLES_REGISTRO_DESCARGA_FRUTA_PARA_PROCESO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MUESTREOS" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "proveedor_id" INTEGER NOT NULL,
    "huertero" TEXT,
    "lote" TEXT NOT NULL,
    "cuidad" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "ton_aprox" DOUBLE PRECISION,
    "bta" DOUBLE PRECISION NOT NULL,
    "acidez" DOUBLE PRECISION NOT NULL,
    "rto" DOUBLE PRECISION NOT NULL,
    "rendimiento" DOUBLE PRECISION NOT NULL,
    "sabor" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "aceite" DOUBLE PRECISION,
    "observaciones" TEXT,
    "analizo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MUESTREOS_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."REGISTRO_DESCARGA_FRUTA_PARA_PROCESO" ADD CONSTRAINT "REGISTRO_DESCARGA_FRUTA_PARA_PROCESO_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "public"."PROVEEDORES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."REGISTRO_DESCARGA_FRUTA_PARA_PROCESO" ADD CONSTRAINT "REGISTRO_DESCARGA_FRUTA_PARA_PROCESO_detalles_id_fkey" FOREIGN KEY ("detalles_id") REFERENCES "public"."DETALLES_REGISTRO_DESCARGA_FRUTA_PARA_PROCESO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
