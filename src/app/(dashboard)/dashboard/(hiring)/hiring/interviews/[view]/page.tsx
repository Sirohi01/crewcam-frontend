import PageLayout from '@/components/ui/pageLayout';
import InterviewWorkspace from '@/components/hiring/InterviewWorkspace';

const VIEWS = ['new', 'list', 'statistics', 'walk-in', 'telephonic', 'hr-hod', 'final'] as const;

export default async function InterviewPage({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  const resolved = VIEWS.includes(view as (typeof VIEWS)[number]) ? view as (typeof VIEWS)[number] : 'list';
  return (
    <PageLayout>
      <div className="min-h-[calc(100vh-48px)]">
        <InterviewWorkspace view={resolved} />
      </div>
    </PageLayout>
  );
}
