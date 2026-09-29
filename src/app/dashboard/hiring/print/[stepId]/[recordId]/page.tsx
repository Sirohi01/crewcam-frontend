import React from 'react';
import SelectionApprovalPrint from '@/components/hiring/print/SelectionApprovalPrint';
import ProbationReviewPrint from '@/components/hiring/print/ProbationReviewPrint';

export default function PrintStepPage({ params }: { params: { stepId: string; recordId: string } }) {
    const { stepId, recordId } = params;

    if (stepId === 'selection-approval') {
        return <SelectionApprovalPrint recordId={recordId} />;
    }

    if (stepId === 'probation-review') {
        return <ProbationReviewPrint recordId={recordId} />;
    }

    // Fallback for steps not yet ported to frontend print
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h2 className="text-xl font-bold text-slate-800">Print view not available</h2>
            <p className="text-slate-500">The print view for this step has not been ported to the frontend yet.</p>
            <p className="text-slate-500">Step ID: {stepId}</p>
        </div>
    );
}
