import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/apis/user/entities/user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'adityasingh393',
      password: 'Aditya@20',
      database: 'testing',
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      entities: [User],
      migrations: [__dirname + '/migrations/*.ts'],
      migrationsRun: true,
      synchronize: false,
    }),
  ],
})
export class DatabaseModule {}
