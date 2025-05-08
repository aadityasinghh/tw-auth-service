import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/**/*.entity.js'], // Ensure your entities are correctly referenced
    migrations: ['dist/core/db/migrations/*.js'], // Ensure migration folder path is correct
    synchronize: false, // Disable auto schema sync in production
    logging: true,
});

export default AppDataSource;
