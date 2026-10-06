"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Settings,
  MapPin,
  Save,
  Info,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Navigation,
  Calendar,
  Clock,
  UploadCloud,
  Loader2,
  ChevronDown,
  Search,
  Globe,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import PageLayout from "@/components/ui/pageLayout";
import {
  FormField,
  FormInput,
  FormSelect,
} from "@/components/shared/FormComponents";
import api from "@/lib/axios";
import { geocodeAddress } from "@/lib/geocode";
import { toast } from "react-hot-toast";
import { usePincodeLookup } from "@/hooks/usePincodeLookup";

const WEEK_DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC",
];

const emptyForm = {
  name: "",
  code: "",
  location: "",
  address: "",
  pincode: "",
  city: "",
  state: "",
  country: "India",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  reportingTo: "",
  effectiveDate: "",
  timezone: "Asia/Kolkata",
  workingDays: ["mon", "tue", "wed", "thu", "fri"] as string[],
  workStart: "09:30",
  workEnd: "18:30",
  logoUrl: "",
  isActive: "Active",
  lat: undefined as number | undefined,
  lng: undefined as number | undefined,
  parentBranch: "",
  businessUnit: "",
  division: "",
  costCenter: "",
  branchHead: "",
  description: "",
  addressLine2: "",
  website: "",
};

export default function AddNewBranchPage() {
  return <AddNewBranchComponent />;
}

export function AddNewBranchComponent({ providedId, isViewMode }: { providedId?: string; isViewMode?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = providedId || searchParams.get("edit");
  const isView = isViewMode || searchParams.get("view") === "true";

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!editId);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [detecting, setDetecting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { lookupPincode, loadingPincode } = usePincodeLookup();

  useEffect(() => {
    if (!editId) return;
    const fetchBranch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/companies/branches/${editId}`);
        const data = res.data.data || res.data || {};
        setForm({
          name: data.name || "",
          code: data.code || "",
          location: data.location || "",
          address: data.address || "",
          pincode: data.pincode || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "India",
          contactPerson: data.contactPerson || "",
          contactPhone: data.contactPhone || "",
          contactEmail: data.contactEmail || "",
          reportingTo: data.reportingTo || "",
          effectiveDate: data.effectiveDate || "",
          timezone: data.timezone || "Asia/Kolkata",
          workingDays: Array.isArray(data.workingDays) && data.workingDays.length > 0
            ? data.workingDays
            : ["mon", "tue", "wed", "thu", "fri"],
          workStart: data.workStart || "09:30",
          workEnd: data.workEnd || "18:30",
          logoUrl: data.logoUrl || "",
          isActive: data.isActive === false ? "Inactive" : "Active",
          lat: data.lat ?? undefined,
          lng: data.lng ?? undefined,
          parentBranch: data.parentBranch?._id || data.parentBranch || "",
          businessUnit: data.businessUnit?._id || data.businessUnit || "",
          division: data.division || "",
          costCenter: data.costCenter || "",
          branchHead: data.branchHead?._id || data.branchHead || "",
          description: data.description || "",
          addressLine2: data.addressLine2 || "",
          website: data.website || "",
        });
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load branch");
      } finally {
        setLoading(false);
      }
    };
    fetchBranch();
  }, [editId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");
        setEmployees(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };
    fetchEmployees();
  }, []);

  const set = (key: string, value: string | number | undefined) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleDay = (key: string) => {
    setForm((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(key)
        ? prev.workingDays.filter((d) => d !== key)
        : [...prev.workingDays, key],
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const toastId = toast.loading("Uploading logo...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set("logoUrl", res.data.url);
      toast.success("Logo uploaded successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload logo", { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    set("pincode", val);

    if (val.length === 6) {
      lookupPincode(val, (loc) => {
        set("city", loc.city || form.city);
        set("state", loc.state || form.state);
        set("country", loc.country || form.country);
      });
    }
  };

  const handleDetectLocation = async () => {
    const queries = [
      [form.address, form.city, form.state, form.pincode, form.country].filter(Boolean).join(", "),
      [form.city, form.state, form.pincode, form.country].filter(Boolean).join(", "),
      [form.city, form.state, form.country].filter(Boolean).join(", "),
    ].filter((q) => q.length > 0);

    if (queries.length === 0) {
      setError("Please enter address details to fetch coordinates.");
      return;
    }
    setDetecting(true);
    try {
      const coords = await geocodeAddress(queries);
      if (coords) {
        set("lat", coords.lat);
        set("lng", coords.lng);
        setError("");
        toast.success("Coordinates captured");
      } else {
        setError("Could not find coordinates for this address. Try simplifying it.");
      }
    } catch (err: any) {
      setError(err.message || "Could not fetch coordinates");
    } finally {
      setDetecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) {
      toast.error("Branch Name and Branch Code are required.");
      return;
    }
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        code: form.code,
        location: form.location,
        address: form.address,
        pincode: form.pincode,
        city: form.city,
        state: form.state,
        country: form.country,
        contactPerson: form.contactPerson,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        reportingTo: form.reportingTo,
        effectiveDate: form.effectiveDate,
        timezone: form.timezone,
        workingDays: form.workingDays,
        workStart: form.workStart,
        workEnd: form.workEnd,
        logoUrl: form.logoUrl,
        lat: form.lat,
        lng: form.lng,
        isActive: form.isActive === "Active",
        parentBranch: form.parentBranch || undefined,
        businessUnit: form.businessUnit || undefined,
        division: form.division || undefined,
        costCenter: form.costCenter || undefined,
        branchHead: form.branchHead || undefined,
        description: form.description,
        addressLine2: form.addressLine2,
        website: form.website,
      };

      if (editId) {
        try {
          await api.put(`/companies/branches/${editId}`, payload);
        } catch {
          await api.put(`/branches/${editId}`, payload);
        }
        toast.success("Branch updated successfully");
      } else {
        try {
          await api.post("/companies/branches", payload);
        } catch {
          await api.post("/branches", payload);
        }
        toast.success("Branch created successfully");
      }
      router.push("/dashboard/branches");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save branch");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex justify-between">

        <PageHeader
          title={isView ? (form.name || "Branch Details") : (editId ? "Edit Branch" : "Add New Branch")}
          description={isView ? "View complete details of this branch." : (editId ? "Edit details for this branch." : "Create a new branch for your organization.")}
          icon={<Building2 size={16} />}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Branches", href: "/dashboard/branches" },
            { label: isView ? (form.name || "Branch Details") : (editId ? "Edit Branch" : "Add New Branch") },
          ]}
        />
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/branches")}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Branch List
          </Button>
          {isView ? (
            <Button
              type="button"
              onClick={() => router.push(`/dashboard/branches/add-new-branch?edit=${editId}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Edit2 className="h-4 w-4 mr-1.5" />
              Edit Branch
            </Button>
          ) : (
            <Button type="submit" form="add-branch-form" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save className="h-4 w-4 mr-1.5" />
              {saving ? "Saving..." : (editId ? "Update Branch" : "Save Branch")}
            </Button>
          )}
        </div>
      </div>
      <form id="add-branch-form" onSubmit={handleSubmit} className="space-y-4">
        <fieldset disabled={isView} className="contents">
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
            {/* Left column */}
            <div className="space-y-2 lg:col-span-2">
              {/* Branch Information */}
              <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
                <CardContent className="p-3">
                  <SectionHeader icon={<Building2 className="h-4 w-4 text-white" />} title="Branch Information" />

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <FormField label="Branch Name" required>
                      <FormInput
                        required
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Enter Branch Name"
                      />
                    </FormField>

                    <FormField label="Branch Code" required>
                      <FormInput
                        required
                        value={form.code}
                        onChange={(e) => set("code", e.target.value)}
                        placeholder="Enter Unique Branch Code"
                      />
                      <p className="text-xs text-gray-400">Example: BR001</p>
                    </FormField>

                    <FormField label="Short Name / Abbreviation">
                      <FormInput
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        placeholder="Enter Short Name"
                      />
                      <p className="text-xs text-gray-400">Example: Noida HO</p>
                    </FormField>

                    <FormField label="Parent Branch">
                      <FormSelect
                        value={form.parentBranch}
                        onChange={(e) => set("parentBranch", e.target.value)}
                        options={[{ label: "Select Parent Branch (if any)", value: "" }]} // Placeholder for actual API data
                      />
                    </FormField>

                    <FormField label="Business Unit" required>
                      <FormSelect
                        value={form.businessUnit}
                        onChange={(e) => set("businessUnit", e.target.value)}
                        options={[{ label: "Select business unit", value: "" }]}
                      />
                    </FormField>

                    <FormField label="Division">
                      <FormSelect
                        value={form.division}
                        onChange={(e) => set("division", e.target.value)}
                        options={[{ label: "Select division", value: "" }]}
                      />
                    </FormField>

                    <FormField label="Cost Center">
                      <FormSelect
                        value={form.costCenter}
                        onChange={(e) => set("costCenter", e.target.value)}
                        options={[{ label: "Select cost center", value: "" }]}
                      />
                    </FormField>

                    <FormField label="Branch Head" required>
                      <FormSelect
                        value={form.branchHead}
                        onChange={(e) => set("branchHead", e.target.value)}
                        options={[
                          { label: "Select branch head", value: "" },
                          ...employees.map(emp => ({
                            label: `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.name || emp.email || "Unknown",
                            value: emp._id
                          }))
                        ]}
                      />
                    </FormField>

                    <div className="sm:col-span-4">
                      <FormField label="Description">
                        <textarea
                          value={form.description}
                          onChange={(e) => set("description", e.target.value)}
                          placeholder="Enter branch description"
                          className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          maxLength={250}
                        />
                        <div className="mt-1 flex justify-between text-xs text-gray-400">
                          <span>Brief description about this branch</span>
                          <span>{form.description.length} / 250</span>
                        </div>
                      </FormField>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
                <CardContent className="p-3">
                  <SectionHeader icon={<MapPin className="h-4 w-4 text-white" />} title="Location Information" />

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <FormField label="Address Line 1" required>
                      <FormInput
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        placeholder="Enter address line 1"
                      />
                    </FormField>

                    <FormField label="Address Line 2">
                      <FormInput
                        value={form.addressLine2}
                        onChange={(e) => set("addressLine2", e.target.value)}
                        placeholder="Enter address line 2 (optional)"
                      />
                    </FormField>

                    <FormField label="Pincode" required>
                      <div className="relative">
                        <FormInput
                          value={form.pincode}
                          onChange={handlePincodeChange}
                          placeholder="Enter pincode"
                        />
                        {loadingPincode && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 animate-spin" />}
                      </div>
                    </FormField>

                    <FormField label="Country" required>
                      <SearchableSelect
                        value={form.country}
                        onChange={(val) => set("country", val)}
                        placeholder="Select Country"
                        options={["India", "United States", "United Kingdom", "Canada", "Australia", "Singapore", "United Arab Emirates", "Germany"]}
                        disabled={isView}
                      />
                    </FormField>

                    <FormField label="State">
                      <SearchableSelect
                        value={form.state}
                        onChange={(val) => set("state", val)}
                        placeholder="Select State"
                        options={["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"]}
                        disabled={isView}
                      />
                    </FormField>

                    <FormField label="City" required>
                      <SearchableSelect
                        value={form.city}
                        onChange={(val) => set("city", val)}
                        placeholder="Select City"
                        options={["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara"]}
                        disabled={isView}
                      />
                    </FormField>

                    <FormField label="Contact Person">
                      <FormInput
                        value={form.contactPerson}
                        onChange={(e) => set("contactPerson", e.target.value)}
                        placeholder="Enter Contact Person"
                      />
                    </FormField>

                    <FormField label="Phone Number">
                      <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden">
                        <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                        <FormInput
                          value={form.contactPhone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) set("contactPhone", val);
                          }}
                          placeholder="Enter 10-digit phone number"
                          className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-full"
                          maxLength={10}
                        />
                      </div>
                    </FormField>

                    <FormField label="Email">
                      <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden">
                        <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                        <FormInput
                          type="email"
                          value={form.contactEmail}
                          onChange={(e) => set("contactEmail", e.target.value)}
                          placeholder="Enter Email Address"
                          className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-full"
                          pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                          title="Please enter a valid email format (e.g. user@gmail.com)"
                        />
                      </div>
                    </FormField>

                    <FormField label="Website">
                      <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden">
                        <Globe className="h-4 w-4 text-zinc-400 shrink-0" />
                        <FormInput
                          type="url"
                          value={form.website}
                          onChange={(e) => set("website", e.target.value)}
                          placeholder="Enter Website"
                          className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-full"
                        />
                      </div>
                    </FormField>

                    <div className="sm:col-span-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDetectLocation}
                        disabled={detecting}
                        className="text-xs"
                      >
                        <Navigation className="h-3.5 w-3.5 mr-1.5" />
                        {detecting
                          ? "Fetching..."
                          : form.lat != null
                            ? `Coordinates captured (${form.lat.toFixed(4)}, ${form.lng!.toFixed(4)})`
                            : "Fetch Coordinates from Address"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-2">
              {/* Branch Settings */}
              <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
                <CardContent className="p-3">
                  <SectionHeader icon={<Settings className="h-4 w-4 text-white" />} title="Branch Settings" />

                  <div className="space-y-2">
                    <FormField label="Status" required>
                      <div className="flex items-center gap-6 mt-1.5 h-9">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            checked={form.isActive === "Active"}
                            onChange={() => set("isActive", "Active")}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                          />
                          <span className="text-[13px] text-slate-800 font-medium">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            checked={form.isActive === "Inactive"}
                            onChange={() => set("isActive", "Inactive")}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                          />
                          <span className="text-[13px] text-slate-800 font-medium">Inactive</span>
                        </label>
                      </div>
                    </FormField>

                    <FormField label="Reporting To">
                      <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden">
                        <User className="h-4 w-4 text-zinc-400 shrink-0" />
                        <FormInput
                          value={form.reportingTo}
                          onChange={(e) => set("reportingTo", e.target.value)}
                          placeholder="Enter reporting manager / department"
                          className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-full"
                        />
                      </div>
                    </FormField>

                    <FormField label="Effective Date">
                      <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden">
                        <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
                        <FormInput
                          type="date"
                          value={form.effectiveDate}
                          onChange={(e) => set("effectiveDate", e.target.value)}
                          className="border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-full"
                        />
                      </div>
                    </FormField>

                    <FormField label="Time Zone">
                      <FormSelect
                        value={form.timezone}
                        onChange={(e) => set("timezone", e.target.value)}
                        options={TIMEZONES.map((tz) => ({ label: tz, value: tz }))}
                      />
                    </FormField>

                    <FormField label="Working Days">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 h-9">
                        {WEEK_DAYS.map((day) => (
                          <label
                            key={day.key}
                            className="flex items-center gap-1.5 text-xs text-gray-600"
                          >
                            <input
                              type="checkbox"
                              checked={form.workingDays.includes(day.key)}
                              onChange={() => toggleDay(day.key)}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            {day.label}
                          </label>
                        ))}
                      </div>
                    </FormField>

                    <FormField label="Standard Working Hours">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-1 items-center justify-between rounded-md border border-slate-200 bg-white px-2 h-9">
                          <Clock className="h-4 w-4 text-zinc-400" />
                          <input
                            type="time"
                            value={form.workStart}
                            onChange={(e) => set("workStart", e.target.value)}
                            className="w-full text-[13px] outline-none bg-transparent pl-2"
                          />
                        </div>
                        <span className="text-[13px] font-medium text-slate-500">To</span>
                        <div className="flex flex-1 items-center justify-between rounded-md border border-slate-200 bg-white px-2 h-9">
                          <Clock className="h-4 w-4 text-zinc-400" />
                          <input
                            type="time"
                            value={form.workEnd}
                            onChange={(e) => set("workEnd", e.target.value)}
                            className="w-full text-[13px] outline-none bg-transparent pl-2"
                          />
                        </div>
                      </div>
                    </FormField>

                    <FormField label="Upload Branch Logo">
                      <div className="flex items-center gap-2">
                        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-zinc-300 px-3 py-2 text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-600">
                          <UploadCloud className="h-4 w-4" />
                          {uploading ? "Uploading..." : form.logoUrl ? "Change Logo" : "Click to upload"}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                        {form.logoUrl && (
                          <span className="text-[10px] text-emerald-600">Logo uploaded</span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-gray-400">
                        The branch logo will be used in branch documentation and reports.
                      </p>
                    </FormField>
                  </div>
                </CardContent>
              </Card>

              {/* Note */}
              <div className="flex gap-2 rounded-xl border border-amber-100 bg-amber-50 p-4">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Note</p>
                  <p className="text-xs text-amber-700">
                    All fields marked with * are mandatory.
                  </p>
                </div>
              </div>
            </div>
          </div>


        </fieldset>
      </form>
    </PageLayout>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600">
        {icon}
      </span>
      <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
    </div>
  );
}

function SearchableSelect({ value, onChange, options, placeholder, disabled }: { value: string, onChange: (val: string) => void, options: string[], placeholder: string, disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Make sure current value is always an option if it's not empty
  const uniqueOptions = Array.from(new Set([...options, value].filter(Boolean)));
  const filtered = search
    ? uniqueOptions.filter(o => o.toLowerCase().includes(search.toLowerCase()))
    : uniqueOptions;

  const handleSelect = (val: string) => {
    if (disabled) return;
    onChange(val);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`flex w-full cursor-pointer h-9 items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-[13px] ${disabled ? 'opacity-70 cursor-not-allowed bg-slate-50' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value ? "text-zinc-900 truncate" : "text-zinc-400"}>{value || placeholder}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-zinc-200 bg-white p-1 shadow-md">
          <div className="sticky top-0 flex items-center border-b border-zinc-100 bg-white px-2 py-1.5">
            <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-zinc-400" />
            <input
              type="text"
              className="w-full text-sm outline-none"
              placeholder="Search or type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && search) {
                  e.preventDefault();
                  handleSelect(search);
                }
              }}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div className="pt-1">
            {filtered.length > 0 ? filtered.map(opt => (
              <div
                key={opt}
                className={`cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-indigo-50 hover:text-indigo-700 ${opt === value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-zinc-700'}`}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </div>
            )) : (
              <div
                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50"
                onClick={() => handleSelect(search)}
              >
                Add "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
