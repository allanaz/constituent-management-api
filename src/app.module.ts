import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConstituentModule } from './constituent/constituent.module';


@Module({
  imports: [ConstituentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
