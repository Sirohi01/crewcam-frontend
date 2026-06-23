import ManpowerRequestsTab from '@/components/hiring/ManpowerRequestsTab';

export default async function ManpowerRequestEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManpowerRequestsTab formOnly requestId={id} />;
}
