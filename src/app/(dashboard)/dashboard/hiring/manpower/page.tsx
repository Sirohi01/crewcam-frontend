import ManpowerRequestsTab from '@/components/hiring/ManpowerRequestsTab';

export default function ManpowerRequestsPage() {
  return <div className="mx-auto max-w-[1400px]"><h1 className="text-xl font-md">Manpower Requests</h1><p className="mt-1 text-sm text-zinc-500">Create, review and approve requisitions before candidate intake.</p><ManpowerRequestsTab /></div>;
}
