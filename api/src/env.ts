import { z } from 'zod';

const envSchemaa = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
});

export const env = envSchemaa.parse(process.env);
