import LiveInterviewSession from '@/components/hiring/LiveInterviewSession';

export default async function LiveInterview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LiveInterviewSession interviewId={id} />;
}
