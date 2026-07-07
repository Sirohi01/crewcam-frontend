import ManpowerRequestDetail from '@/components/hiring/ManpowerRequestDetail';

export default async function ManpowerRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ManpowerRequestDetail id={id} />;
}
