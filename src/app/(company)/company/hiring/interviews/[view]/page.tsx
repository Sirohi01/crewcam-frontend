import InterviewWorkspace from '@/components/hiring/InterviewWorkspace';

const VIEWS = ['new', 'list', 'statistics', 'walk-in', 'telephonic', 'hr-hod', 'final'] as const;

export default async function InterviewPage({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  const resolved = VIEWS.includes(view as (typeof VIEWS)[number]) ? view as (typeof VIEWS)[number] : 'list';
  return <InterviewWorkspace view={resolved} />;
}
