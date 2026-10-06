'use client';
import { useParams } from 'next/navigation';
import JobRequisitionForm from '@/components/hiring/JobRequisitionForm';

export default function EditJobRequisitionPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return <JobRequisitionForm id={id} />;
}
