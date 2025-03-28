import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { ApiModule } from './apis/api.module';

@Module({
  imports: [CoreModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
