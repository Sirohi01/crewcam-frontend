"use client";
import { use } from "react";
import { AddNewBranchComponent } from "../add-new-branch/page";

export default function BranchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AddNewBranchComponent providedId={id} isViewMode={true} />;
}
