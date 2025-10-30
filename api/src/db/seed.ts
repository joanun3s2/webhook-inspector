import { db } from '../db';
import { webhooks } from './schema';

const getRandomDate = (): Date => {
  return new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
};

export const seed = async () => {
  const requests = [
    {
      pathname: '/payments/bills',
      method: 'POST',
      body: '{ "amount": 1000, "currency": "usd" }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/payments/charges',
      method: 'POST',
      body: '{ "amount": 1000, "currency": "usd" }',
    },
    {
      pathname: '/payments/refunds',
      createdAt: getRandomDate(),
      method: 'POST',
      body: '{ "amount": 1000, "currency": "usd" }',
    },
    {
      pathname: '/payments/subscriptions',
      createdAt: getRandomDate(),
      method: 'POST',
      body: '{ "plan": "yearly", "amount": 1000, "currency": "usd" }',
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_123", "amount": 1000, "currency": "usd", "status": "paid" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_456", "amount": 2000, "currency": "eur", "status": "pending" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_789", "amount": 3000, "currency": "aud", "status": "failed" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_012", "amount": 4000, "currency": "cad", "status": "refunded" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_345", "amount": 5000, "currency": "gbp", "status": "draft" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/payments/subscriptions',
      method: 'POST',
      body: '{ "plan": "yearly", "amount": 1000, "currency": "usd" }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_123", "amount": 1000, "currency": "usd", "status": "paid" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_456", "amount": 1000, "currency": "usd", "status": "pending" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_789", "amount": 1000, "currency": "usd", "status": "failed" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_012", "amount": 1000, "currency": "usd", "status": "paid" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_345", "amount": 1000, "currency": "usd", "status": "pending" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_678", "amount": 1000, "currency": "usd", "status": "failed" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_901", "amount": 1000, "currency": "usd", "status": "paid" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_234", "amount": 1000, "currency": "usd", "status": "pending" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_567", "amount": 1000, "currency": "usd", "status": "failed" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_890", "amount": 1000, "currency": "usd", "status": "paid" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_123", "amount": 1000, "currency": "usd", "status": "pending" } }',
      createdAt: getRandomDate(),
    },
    {
      pathname: '/webhooks/invoices',
      method: 'POST',
      body: '{ "invoice": { "id": "inv_456", "amount": 1000, "currency": "usd", "status": "failed" } }',
      createdAt: getRandomDate(),
    },
  ];

  console.log('Cleaning Database...');

  try {
    await db.delete(webhooks).execute();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(`Seeding ${requests.length} webhooks...`);

  try {
    await Promise.all(
      requests.map(async (request) => {
        return db
          .insert(webhooks)
          .values({
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': request.body!.length.toString(),
            },

            method: request.method,
            pathname: request.pathname,
            ip: '127.0.0.1',
            contentType: 'application/json',
            contentLength: request.body!.length,
            body: JSON.stringify(JSON.parse(request.body!), null, 2),
            createdAt: request.createdAt,
          })
          .returning();
      })
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.log('Seeding complete');
  process.exit(0);
};

seed();
