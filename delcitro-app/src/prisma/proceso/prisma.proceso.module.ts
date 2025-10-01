import { Global, Module } from '@nestjs/common';
import { PrismaProcesoService } from './prisma.proceso.service';

@Global()
@Module({ providers: [PrismaProcesoService], exports: [PrismaProcesoService] })
export class PrismaProcesoModule {}
