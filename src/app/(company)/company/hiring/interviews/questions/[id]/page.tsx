import InterviewQuestionsPage from '@/components/hiring/InterviewQuestionsPage';

export default async function InterviewQuestions({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InterviewQuestionsPage interviewId={id} />;
}
