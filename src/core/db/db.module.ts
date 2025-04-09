import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/apis/user/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      entities: [User],
      migrations: [__dirname + '/migrations/*.ts'],
      migrationsRun: true,
      synchronize: false,
    }),
  ],
})
export class DatabaseModule {}
