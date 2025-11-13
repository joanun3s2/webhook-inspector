import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { webhooks } from '@/db/schema';
import { findWebhookById } from '@/service/webhook.service';

export const getWebhook: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/webhooks/:id',
    {
      schema: {
        summary: 'Get a specific webhook by ID',
        tags: ['Webhooks'],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          200: createSelectSchema(webhooks),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const webhook = await findWebhookById(id);

      if (!webhook) {
        return reply.status(404).send({ message: 'Webhook not found' });
      }

      return reply.send(webhook);
    }
  );
};
