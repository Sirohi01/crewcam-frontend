'use client';
import { useState, useEffect } from "react";
import { Pencil, Settings, Loader2, Info, Phone, Package, TrendingUp, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import PageLayout from "@/components/ui/pageLayout";
import { SectionCard } from "@/components/cards/SectionCard";
// import {
//   CompanyProfileAbout,
//   CompanyProfileContact,
//   CompanyProfileDocuments,
//   CompanyProfileHeader,
//   CompanyProfileKeyInfo,
//   CompanyProfileModules,
//   CompanyProfileQuickLinks,
//   CompanyProfileStats,
//   CompanyProfileTabs,
// } from "@/components/company-profile";
import type { CompanyProfile } from "@/services/companyService";
import api from "@/lib/axios";
import { CompanyProfileQuickLinks } from "@/components/company-profile/CompanyProfileQuickLinks";
import { CompanyProfileDocuments } from "@/components/company-profile/CompanyProfileDocuments";
import { CompanyProfileStats } from "@/components/company-profile/CompanyProfileStats";
import { CompanyProfileModules } from "@/components/company-profile/CompanyProfileModules";
import { CompanyProfileKeyInfo } from "@/components/company-profile/CompanyProfileKeyInfo";
import { CompanyProfileContact } from "@/components/company-profile/CompanyProfileContact";
import { CompanyProfileAbout } from "@/components/company-profile/CompanyProfileAbout";
import { CompanyProfileTabs } from "@/components/company-profile/CompanyProfileTabs";
import { CompanyProfileHeader } from "@/components/company-profile/CompanyProfileHeader";

const DOCUMENT_META: { key: string; name: string }[] = [
  { key: "incorporationCertUrl", name: "Certificate of Incorporation" },
  { key: "gstCertUrl", name: "GST Registration Certificate" },
  { key: "panCardUrl", name: "PAN Card" },
  { key: "otherDocumentUrl", name: "Other Document" },
];

function toCompanyProfile(raw: any, counts: { departments: number; employees: number; locations: number; designations: number }): CompanyProfile {
  const modules = [
    ...(Array.isArray(raw.selectedModules) ? raw.selectedModules : []),
    ...(Array.isArray(raw.addonModules) ? raw.addonModules : []),
  ];

  const documents = DOCUMENT_META
    .map((doc) => ({ name: doc.name, date: "", url: raw.documents?.[doc.key] || "" }))
    .filter((doc) => doc.url);

  return {
    _id: raw._id || "",
    name: raw.tradeName || raw.legalName || "Company",
    legalName: raw.legalName || raw.tradeName || "Company",
    companyCode: raw.corporateId || "",
    businessType: raw.companyType || "",
    industry: raw.industry || "",
    panNumber: raw.panNumber || "",
    gstNumber: raw.gstin || "",
    website: raw.website || "",
    establishedDate: raw.incorporationDate || "",
    companySize: raw.companySize || "",
    address: {
      registeredOffice: [raw.addressLine1, raw.addressLine2].filter(Boolean).join(", "),
      city: raw.city || "",
      state: raw.state || "",
      country: raw.country || "",
      pincode: raw.postalCode || "",
    },
    contact: {
      phone: raw.phone || "",
      email: raw.email || "",
      hrEmail: raw.alternateEmail || raw.supportEmail || "",
    },
    description: raw.description || "",
    mission: raw.mission || "",
    vision: raw.vision || "",
    logo: raw.logoUrl || "",
    coverImage: raw.coverImage || "",
    lifecycleStatus: "Active",
    modules,
    documents,
    stats: {
      totalEmployees: counts.employees,
      departments: counts.departments,
      locations: counts.locations,
      activePositions: counts.designations,
    },
  };
}

export default function CompanyProfilePage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      const [profRes, brRes, deptRes, desigRes, empRes] = await Promise.all([
        api.get('/companies/profile').catch(() => ({ data: {} })),
        api.get('/companies/branches?limit=1').catch(() => ({ data: { data: [], meta: { total: 0 } } })),
        api.get('/companies/departments?limit=1').catch(() => ({ data: { data: [], meta: { total: 0 } } })),
        api.get('/companies/designations?limit=1').catch(() => ({ data: { data: [], meta: { total: 0 } } })),
        api.get('/employees?limit=1').catch(() => ({ data: { meta: { total: 0 } } }))
      ]);

      setProfile(toCompanyProfile(profRes.data || {}, {
        departments: deptRes.data?.meta?.total || 0,
        employees: empRes.data?.meta?.total || 0,
        locations: brRes.data?.meta?.total || 0,
        designations: desigRes.data?.meta?.total || 0,
      }));
    } catch (error) {
      console.error('Error fetching company profile', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const TABS = [
    { label: "Overview" },
    { label: "Departments", count: profile.stats.departments },
    { label: "Employees", count: profile.stats.totalEmployees },
    { label: "Locations", count: profile.stats.locations },
    { label: "Documents", count: profile.documents.length },
    { label: "Settings" },
  ];

  return (
    <PageLayout>
        <div className="flex justify-between items-center">

      <PageHeader
        title="Company Profile"
        description="View and manage your organization profile and settings."
        breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Company Profile" },
        ]}
        />

      <div className="mb-4 flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-1.5" />
          Edit Profile
        </Button>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Settings className="h-4 w-4 mr-1.5" />
          Company Settings
        </Button>
      </div>
        </div>

      <CompanyProfileHeader
        company={profile}
        onEditProfile={() => {}}
        onCompanySettings={() => {}}
      />

      <CompanyProfileTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <SectionCard title="About Company" icon={<Info className="h-4 w-45 text-blue-700" />}>
            <CompanyProfileAbout company={profile} />
          </SectionCard>

          <SectionCard title="Contact Details" icon={<Phone className="h-4 w-45 text-blue-700" />}>
            <CompanyProfileContact company={profile} />
          </SectionCard>
        </div>

        <div className="flex flex-col gap-2">
          <SectionCard title="Key Information" icon={<Info className="h-4 w-45 text-blue-700" />}>
            <CompanyProfileKeyInfo company={profile} />
          </SectionCard>

          <SectionCard title="Modules In Use" icon={<Package className="h-4 w-45 text-blue-700" />}>
            <CompanyProfileModules company={profile} />
          </SectionCard>
        </div>

        <div className="flex flex-col gap-2">
          <SectionCard title="Company Statistics" icon={<TrendingUp className="h-4 w-4 text-blue-700" />}>
            <CompanyProfileStats company={profile} />
          </SectionCard>

          <SectionCard title="Company Documents" icon={<FileText className="h-4 w-4 text-blue-700" />}>
            <CompanyProfileDocuments company={profile} />
          </SectionCard>

          <SectionCard title="Quick Links" icon={<ChevronRight className="h-4 w-4 text-blue-700" />}>
            <CompanyProfileQuickLinks />
          </SectionCard>
        </div>
      </div>
    </PageLayout>
  );
}
