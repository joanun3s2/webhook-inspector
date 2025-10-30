import { Panel } from 'react-resizable-panels';
import { WebhookDetailHeader } from '../components/ui/webhook-detail-header';
import { SectionTitle } from '../components/section-title';
import { SectionDataTable } from '../components/section-data-table';
import { CodeBlock } from '../components/ui/code-block';
import { useSuspenseQuery } from '@tanstack/react-query';
import { webhookDetailsSchema } from '../http/schemas/webhooks';

interface WebhookDetailHeaderProps {
  id: string;
}

export function WebhookDetails({ id }: WebhookDetailHeaderProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['webhooks', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/api/webhooks/${id}`);
      const data = await response.json();

      return webhookDetailsSchema.parse(data);
    },
  });

  const overviewData = [
    {
      key: 'Method',
      value: data.method,
    },
    {
      key: 'Status Code',
      value: String(data.statusCode),
    },
    {
      key: 'Content-type',
      value: data.contentType ?? 'application/json',
    },
    {
      key: 'Content-length',
      value: `${data.contentLength ?? 0} bytes`,
    },
  ];

  const headers = Object.entries(data.headers).map(([key, value]) => ({
    key,
    value,
  }));

  const queryParams = Object.entries(data.queryParams ?? {}).map(
    ([key, value]) => ({
      key,
      value,
    })
  );

  return (
    <Panel defaultSize={60} minSize={40} maxSize={80}>
      <div className='flex h-full flex-col'>
        <WebhookDetailHeader
          method={data.method}
          pathname={data.pathname}
          ip={data.ip}
          createdAt={data.createdAt}
        />

        <div className='flex-1 overflow-y-auto'>
          <div className='space-y-6 p-6'>
            <div className='space-y-4'>
              <SectionTitle>Request overview</SectionTitle>
              <SectionDataTable data={overviewData} />
            </div>

            {queryParams.length > 0 && (
              <div className='space-y-4'>
                <SectionTitle>Query parameters</SectionTitle>
                <SectionDataTable data={queryParams} />
              </div>
            )}

            <div className='space-y-4'>
              <SectionTitle>Headers</SectionTitle>
              <SectionDataTable data={headers} />
            </div>

            {!!data.body && (
              <div className='space-y-4'>
                <SectionTitle>Request body</SectionTitle>
                <CodeBlock code={data.body} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}
