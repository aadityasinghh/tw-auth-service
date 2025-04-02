import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { ApiModule } from './apis/api.module';
import { AuthModule } from './apis/auth/auth.module';

@Module({
  imports: [CoreModule, ApiModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
