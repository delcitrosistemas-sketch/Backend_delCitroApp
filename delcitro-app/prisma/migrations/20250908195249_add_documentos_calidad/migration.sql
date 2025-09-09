-- AlterEnum
ALTER TYPE "public"."GENEROS" ADD VALUE 'OTROS';

-- AlterTable
ALTER TABLE "public"."EMPLEADOS" ADD COLUMN     "num_emp" SERIAL NOT NULL;

-- CreateTable
CREATE TABLE "public"."DOCUMENTOS_SGC" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "archivo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "archivoUrl" TEXT NOT NULL,
    "extension" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER,

    CONSTRAINT "DOCUMENTOS_SGC_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DOCUMENTOS_SGC" ADD CONSTRAINT "DOCUMENTOS_SGC_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."USUARIOS"("id") ON DELETE SET NULL ON UPDATE CASCADE;
