import { Webhook, webhooks } from '@/db/schema';
import { findWebhookPage } from '@/service/webhook.service';
import { createSelectSchema } from 'drizzle-zod';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/webhooks',
    {
      schema: {
        summary: 'List webhooks',
        tags: ['Webhooks'],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
          cursor: z.string().optional(),
        }),
        response: {
          200: z.object({
            webhooks: z.array(
              createSelectSchema(webhooks).pick({
                id: true,
                method: true,
                pathname: true,
                createdAt: true,
              })
            ),
            nextCursor: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { limit, cursor } = request.query;

      const { webhooks, nextCursor } = await findWebhookPage(limit, cursor);

      return reply.send({
        webhooks: webhooks as Webhook[],
        nextCursor,
      });
    }
  );
};
