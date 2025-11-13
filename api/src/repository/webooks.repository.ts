import { db } from '@/db';
import { InsertWebhook, Webhook, webhooks } from '@/db/schema';
import { eq, lt, asc, SQL } from 'drizzle-orm';

const insert = async (webhook: InsertWebhook): Promise<Webhook> => {
  const result = await db.insert(webhooks).values(webhook).returning();
  return result[0];
};

const findById = async (id: string): Promise<Webhook | null> => {
  const result = await db
    .select()
    .from(webhooks)
    .where(eq(webhooks.id, id))
    .limit(1);

  return result[0];
};

const find = async (query: {
  select: Partial<Record<keyof Webhook, any>>;
  where: SQL;
}): Promise<Partial<Webhook>[] | null> => {
  const result = await db
    .select(query.select)
    .from(webhooks)
    .where(query.where);

  return result;
};

const findPage = async (
  limit: number,
  cursor?: string
): Promise<{ webhooks: Partial<Webhook>[]; nextCursor: string | null }> => {
  const result = await db
    .select({
      id: webhooks.id,
      method: webhooks.method,
      pathname: webhooks.pathname,
      createdAt: webhooks.createdAt,
    })
    .from(webhooks)
    .where(cursor ? lt(webhooks.id, cursor) : undefined)
    .orderBy(asc(webhooks.id))
    .limit(limit + 1);

  const hasMore = result.length > limit;
  const items = hasMore ? result.slice(0, limit) : result;
  const nextCursor = hasMore ? result[result.length - 1].id : null;

  return {
    webhooks: items,
    nextCursor,
  };
};

const deleteById = async (id: string) => {
  return await db.delete(webhooks).where(eq(webhooks.id, id)).returning();
};

export { insert, findById, find, findPage, deleteById };
