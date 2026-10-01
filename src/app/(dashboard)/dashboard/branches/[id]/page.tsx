"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Info,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Calendar,
  Clock,
  Settings,
  Edit2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import PageLayout from "@/components/ui/pageLayout";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function BranchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        let res;
        try {
          res = await api.get(`/companies/branches/${id}`);
        } catch {
          res = await api.get(`/branches/${id}`);
        }
        const data = res.data?.data || res.data || {};
        setBranch(data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load branch details");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBranch();
    }
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-zinc-500 font-medium">Loading branch details...</p>
        </div>
      </PageLayout>
    );
  }

  if (!branch) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <p className="text-zinc-500 font-medium">Branch not found.</p>
          <Button variant="outline" onClick={() => router.push("/dashboard/branches")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Branches
          </Button>
        </div>
      </PageLayout>
    );
  }

  const WEEK_DAYS = [
    { key: "mon", label: "Mon" },
    { key: "tue", label: "Tue" },
    { key: "wed", label: "Wed" },
    { key: "thu", label: "Thu" },
    { key: "fri", label: "Fri" },
    { key: "sat", label: "Sat" },
    { key: "sun", label: "Sun" },
  ];

  return (
    <PageLayout>
      <div className="flex justify-between mb-4">
        <PageHeader
          title={branch.name || "Branch Details"}
          description="View complete details of this branch."
          icon={<Building2 size={16} />}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Branches", href: "/dashboard/branches" },
            { label: branch.name || "Branch Details" },
          ]}
        />
        <div className="flex items-center justify-end gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/branches")}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Branch List
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/branches/add-new-branch?edit=${branch._id || id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Edit2 className="h-4 w-4 mr-1.5" />
            Edit Branch
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-2 lg:col-span-2">
          {/* Branch Information */}
          <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
            <CardContent className="p-2">
              <SectionHeader icon={<Building2 className="h-4 w-4 text-white" />} title="Branch Information" />
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3 mt-3">
                <ReadOnlyField label="Branch Name" value={branch.name} />
                <ReadOnlyField label="Branch Code" value={branch.code} />
                <ReadOnlyField label="Short Name / Abbreviation" value={branch.location} />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
            <CardContent className="p-2">
              <SectionHeader icon={<MapPin className="h-4 w-4 text-white" />} title="Location Information" />
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3 mt-3">
                <div className="sm:col-span-3">
                  <ReadOnlyField label="Address Line 1" value={branch.address} />
                </div>
                <ReadOnlyField label="City" value={branch.city} />
                <ReadOnlyField label="State" value={branch.state} />
                <ReadOnlyField label="Pincode" value={branch.pincode} />
                <ReadOnlyField label="Country" value={branch.country || "India"} />
                <ReadOnlyField label="Contact Person" value={branch.contactPerson} icon={<User className="h-4 w-4 text-zinc-400" />} />
                <ReadOnlyField label="Phone Number" value={branch.contactPhone} icon={<Phone className="h-4 w-4 text-zinc-400" />} />
                <div className="sm:col-span-2">
                  <ReadOnlyField label="Email" value={branch.contactEmail} icon={<Mail className="h-4 w-4 text-zinc-400" />} />
                </div>
                {branch.lat && branch.lng && (
                  <div className="sm:col-span-1">
                    <p className="mb-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Coordinates</p>
                    <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-900 truncate">
                      {branch.lat}, {branch.lng}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {/* Branch Settings */}
          <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
            <CardContent className="p-2">
              <SectionHeader icon={<Settings className="h-4 w-4 text-white" />} title="Branch Settings" />
              <div className="space-y-5 mt-3">
                <div className="flex items-center gap-3">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Status</p>
                  <div className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${branch.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {branch.isActive !== false ? "Active" : "Inactive"}
                  </div>
                </div>

                <ReadOnlyField label="Reporting To" value={branch.reportingTo} icon={<User className="h-4 w-4 text-zinc-400" />} />
                <ReadOnlyField label="Effective Date" value={branch.effectiveDate} icon={<Calendar className="h-4 w-4 text-zinc-400" />} />
                <ReadOnlyField label="Time Zone" value={branch.timezone || "Asia/Kolkata"} />

                <div>
                  <p className="mb-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Working Days</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    {WEEK_DAYS.map((day) => {
                      const isWorking = (branch.workingDays || ["mon", "tue", "wed", "thu", "fri"]).includes(day.key);
                      return (
                        <div key={day.key} className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
                          <div className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${isWorking ? 'border-indigo-600 bg-indigo-600' : 'border-zinc-300 bg-zinc-100'}`}>
                            {isWorking && <div className="h-1.5 w-1.5 rounded-[1px] bg-white" />}
                          </div>
                          {day.label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Standard Working Hours</p>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-1 items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                      <Clock className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-900">{branch.workStart || "09:30"}</span>
                    </div>
                    <span className="text-xs text-zinc-400">To</span>
                    <div className="flex flex-1 items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                      <Clock className="h-4 w-4 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-900">{branch.workEnd || "18:30"}</span>
                    </div>
                  </div>
                </div>

                {branch.logoUrl && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Branch Logo</p>
                    <div className="rounded-md border border-zinc-200 bg-white p-2 w-20 h-20 flex items-center justify-center">
                      <img src={branch.logoUrl} alt="Branch Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600">
        {icon}
      </span>
      <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
    </div>
  );
}

function ReadOnlyField({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">{label}</p>
      <div className={`flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 ${!value ? 'text-zinc-400' : 'text-zinc-900'}`}>
        {icon}
        <span className="text-sm font-medium truncate">{value || "-"}</span>
      </div>
    </div>
  );
}
