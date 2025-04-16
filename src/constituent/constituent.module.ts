import { Module } from '@nestjs/common';
import { PrismaModule } from "../prisma.module"
import { ConstituentService } from './constituent.service';
import { ConstituentController } from './constituent.controller';

@Module({
  imports: [PrismaModule],
  providers: [ConstituentService],
  controllers: [ConstituentController]
})
export class ConstituentModule {}
