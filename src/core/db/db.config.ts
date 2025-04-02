import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'adityasingh393',
  password: 'Aditya@20',
  database: 'tw-auth',
  entities: ['dist/**/*.entity.js'], // Ensure your entities are correctly referenced
  migrations: ['dist/core/db/migrations/*.js'], // Ensure migration folder path is correct
  synchronize: false, // Disable auto schema sync in production
  logging: true,
});

export default AppDataSource;
