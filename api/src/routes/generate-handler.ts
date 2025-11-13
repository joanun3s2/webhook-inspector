import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { webhooks } from '@/db/schema';
import { db } from '@/db';
import { inArray } from 'drizzle-orm';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export const generateHandler: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/api/generate',
    {
      schema: {
        summary: 'Generate a Typescript handler',
        tags: ['Webhooks'],
        body: z.object({
          webhookIds: z.array(z.uuidv7()),
        }),
        response: {
          201: z.object({
            code: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { webhookIds } = request.body;

      const result = await db
        .select({
          body: webhooks.body,
        })
        .from(webhooks)
        .where(inArray(webhooks.id, webhookIds));

      const webhooksBodies = result.map((webhook) => webhook.body).join('\n\n');

      const prompt = `
You are a TypeScript coding assistant.

I will provide one or multiple JSON request bodies, separated by two newlines (\n\n). For each request body, generate a separate TypeScript handler function that accepts the same structure as input and returns a placeholder response (for example, an object with 'status', 'message', and 'data').

Requirements:
- Output only TypeScript code (no explanations or markdown formatting)
- Each handler should be named based on the body's context (use a descriptive name derived from the keys)
- Add minimal inline comments only when necessary
- Functions should be exported and async

Example input:
{
  "email": "user@example.com",
  "password": "123456"
}

{
  "userId": 1,
  "items": ["apple", "banana"]
}

use the zod lib to validate the request body.

Now generate the handler functions for the following request bodies:
${webhooksBodies}
`;

      const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        prompt,
      });

      return reply.status(201).send({ code: text });
    }
  );
};
