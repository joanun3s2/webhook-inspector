import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { handleCapture } from '@/service/webhook.service';

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
      const webhook = await handleCapture(request);

      return reply.send({ id: webhook.id });
    }
  );
};
