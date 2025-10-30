import { Module } from '@nestjs/common';
import { FoliosController } from './folios.controller';
import { FoliosService } from './folios.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FoliosController],
  providers: [FoliosService, PrismaService],
})
export class FoliosModule {}
