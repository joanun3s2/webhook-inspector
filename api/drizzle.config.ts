import { env } from '@/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
  },
  out: './src/db/migrations',
  schema: './src/db/schema/index.ts',
  casing: 'camelCase',
});
