import { Pool } from 'pg';
import settings from '../config/settings';

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: settings.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

export default pool; 