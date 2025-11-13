import { Webhook, webhooks } from '@/db/schema';
import { aiPrompt } from '@/helper/consts/ai.consts';
import {
  deleteById,
  find,
  findById,
  findPage,
  insert,
} from '@/repository/webooks.repository';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { inArray } from 'drizzle-orm';
import { FastifyRequest } from 'fastify';

const handleCapture = async (request: FastifyRequest): Promise<Webhook> => {
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

  return await insert(item);
};

const deleteWebhookById = async (id: string): Promise<boolean> => {
  const result = await deleteById(id);
  return result.length > 0;
};

const findWebhookById = async (id: string): Promise<Webhook | null> => {
  return await findById(id);
};

const findWebhook = async (select: any): Promise<Webhook | null> => {
  return await findById(select);
};

const findWebhookPage = async (
  limit: number,
  cursor?: string
): Promise<{ webhooks: Partial<Webhook>[]; nextCursor: string | null }> => {
  return await findPage(limit, cursor);
};

const generateWebhookHandlers = async (ids: string[]): Promise<string> => {
  const result = await find({
    select: { body: webhooks.body },
    where: inArray(webhooks.id, ids),
  });

  if (!result?.length) {
    throw new Error('No webhooks found');
  }

  const webhooksBodies = result.map((webhook) => webhook.body).join('\n\n');

  const prompt = `
${aiPrompt}
${webhooksBodies}`;

  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt,
  });

  return text;
};

export {
  handleCapture,
  deleteWebhookById,
  findWebhookById,
  findWebhookPage,
  generateWebhookHandlers,
  findWebhook,
};
