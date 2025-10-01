import { Module } from '@nestjs/common';
import { FoliosController } from './folios.controller';
import { FoliosService } from './folios.service';
import { PrismaProcesoService } from 'src/prisma/proceso/prisma.proceso.service';

@Module({
  controllers: [FoliosController],
  providers: [FoliosService, PrismaProcesoService],
})
export class FoliosModule {}
