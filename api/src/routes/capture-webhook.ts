import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { webhooks } from '@/db/schema';
import { db } from '@/db';

export const captureWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.all(
    '/capture*',
    {
      schema: {
        summary: 'Capture incoming webhook requests',
        tags: ['External'],
        hide: true,
        response: {
          201: z.object({
            id: z.uuidv7(),
          }),
        },
      },
    },
    async (request, reply) => {
      const item = {
        method: request.method,
        ip: request.ip,
        contentType: request.headers['content-type'],
        contentLength: request.headers['content-length']
          ? Number(request.headers['content-length'])
          : null,
        body:
          typeof request.body === 'string'
            ? request.body
            : JSON.stringify(request.body),
        pathname: new URL(request.url).pathname.replace('/capture', ''),
        headers: Object.fromEntries(
          Object.entries(request.headers).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(', ') : value || '',
          ])
        ),
      };

      const result = await db.insert(webhooks).values(item).returning();

      return reply.send({ id: result[0].id });
    }
  );
};
