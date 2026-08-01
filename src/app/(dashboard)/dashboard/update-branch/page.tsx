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
};

export default function UpdateBranch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const branchId = searchParams.get("id");

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!branchId);
  const [error, setError] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!branchId) return;
    const fetchBranch = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/companies/branches/${branchId}`);
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
          workingDays:
            Array.isArray(data.workingDays) && data.workingDays.length > 0
              ? data.workingDays
              : ["mon", "tue", "wed", "thu", "fri"],
          workStart: data.workStart || "09:30",
          workEnd: data.workEnd || "18:30",
          logoUrl: data.logoUrl || "",
          isActive: data.isActive === false ? "Inactive" : "Active",
          lat: data.lat ?? undefined,
          lng: data.lng ?? undefined,
        });
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load branch");
      } finally {
        setLoading(false);
      }
    };
    fetchBranch();
  }, [branchId]);

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
    const val = e.target.value;
    set("pincode", val);
    if (val.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          set("city", postOffice.District || postOffice.Block || form.city);
          set("state", postOffice.State || form.state);
          set("country", postOffice.Country || form.country);
        }
      } catch (err) {
        console.error("Failed to fetch pincode details", err);
      }
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
      };
      if (branchId) {
        await api.put(`/companies/branches/${branchId}`, payload);
        toast.success("Branch updated successfully");
      } else {
        await api.post("/companies/branches", payload);
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
        title="Update Branch"
        description="Update branch information for your organization."
        icon={<Building2 size={16} />}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Branches", href: "/dashboard/branches" },
          { label: "Update Branch" },
        ]}
      />
   <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/branches")}
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Branch List
          </Button>
          <Button type="submit" form="update-branch-form" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Save className="h-4 w-4 mr-1.5" />
            {saving ? "Saving..." : "Update Branch"}
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white py-20 text-sm text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600 mr-2" />
          Loading branch details...
        </div>
      ) : (
      <form id="update-branch-form" onSubmit={handleSubmit} className="space-y-4">
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

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <FormField label="Branch Name" required>
                    <FormInput
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Enter branch name"
                    />
                  </FormField>

                  <FormField label="Branch Code" required>
                    <FormInput
                      required
                      value={form.code}
                      onChange={(e) => set("code", e.target.value)}
                      placeholder="Enter unique branch code"
                    />
                    <p className="mt-1 text-xs text-gray-400">Example: BR001</p>
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField label="Short Name / Abbreviation">
                      <FormInput
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        placeholder="Enter short name (optional)"
                      />
                      <p className="mt-1 text-xs text-gray-400">Example: Noida HO</p>
                    </FormField>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
              <CardContent className="p-3">
                <SectionHeader icon={<MapPin className="h-4 w-4 text-white" />} title="Location Information" />

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FormField label="Address Line 1" required>
                      <FormInput
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        placeholder="Enter address line 1"
                      />
                    </FormField>
                  </div>

                  <FormField label="City" required>
                    <FormInput
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      placeholder="Enter city"
                    />
                  </FormField>

                  <FormField label="State">
                    <FormInput
                      value={form.state}
                      onChange={(e) => set("state", e.target.value)}
                      placeholder="Enter state"
                    />
                  </FormField>

                  <FormField label="Pincode" required>
                    <FormInput
                      value={form.pincode}
                      onChange={handlePincodeChange}
                      placeholder="Enter pincode"
                    />
                  </FormField>

                  <FormField label="Country" required>
                    <FormInput
                      value={form.country}
                      onChange={(e) => set("country", e.target.value)}
                      placeholder="Enter country"
                    />
                  </FormField>

                  <FormField label="Contact Person">
                    <FormInput
                      value={form.contactPerson}
                      onChange={(e) => set("contactPerson", e.target.value)}
                      placeholder="Enter contact person"
                    />
                  </FormField>

                  <FormField label="Phone Number">
                    <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5">
                      <Phone className="h-4 w-4 text-zinc-400" />
                      <FormInput
                        value={form.contactPhone}
                        onChange={(e) => set("contactPhone", e.target.value)}
                        placeholder="Enter phone number"
                        className="border-0 bg-transparent px-0 focus:ring-0"
                      />
                    </div>
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField label="Email">
                      <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5">
                        <Mail className="h-4 w-4 text-zinc-400" />
                        <FormInput
                          type="email"
                          value={form.contactEmail}
                          onChange={(e) => set("contactEmail", e.target.value)}
                          placeholder="Enter email address"
                          className="border-0 bg-transparent px-0 focus:ring-0"
                        />
                      </div>
                    </FormField>
                  </div>

                  <div className="sm:col-span-2">
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

                <div className="space-y-5">
                  <FormField label="Status" required>
                    <FormSelect
                      value={form.isActive}
                      onChange={(e) => set("isActive", e.target.value)}
                      options={[
                        { label: "Active", value: "Active" },
                        { label: "Inactive", value: "Inactive" },
                      ]}
                    />
                  </FormField>

                  <FormField label="Reporting To">
                    <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5">
                      <User className="h-4 w-4 text-zinc-400" />
                      <FormInput
                        value={form.reportingTo}
                        onChange={(e) => set("reportingTo", e.target.value)}
                        placeholder="Enter reporting manager / department"
                        className="border-0 bg-transparent px-0 focus:ring-0"
                      />
                    </div>
                  </FormField>

                  <FormField label="Effective Date">
                    <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      <FormInput
                        type="date"
                        value={form.effectiveDate}
                        onChange={(e) => set("effectiveDate", e.target.value)}
                        className="border-0 bg-transparent px-0 focus:ring-0"
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
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
                      <div className="flex flex-1 items-center justify-between rounded-md border border-zinc-200 bg-white px-2 py-1">
                        <Clock className="h-4 w-4 text-zinc-400" />
                        <input
                          type="time"
                          value={form.workStart}
                          onChange={(e) => set("workStart", e.target.value)}
                          className="w-full text-xs outline-none"
                        />
                      </div>
                      <span className="text-xs text-gray-400">To</span>
                      <div className="flex flex-1 items-center justify-between rounded-md border border-zinc-200 bg-white px-2 py-1">
                        <Clock className="h-4 w-4 text-zinc-400" />
                        <input
                          type="time"
                          value={form.workEnd}
                          onChange={(e) => set("workEnd", e.target.value)}
                          className="w-full text-xs outline-none"
                        />
                      </div>
                    </div>
                  </FormField>

                  <FormField label="Upload Branch Logo">
                    <div className="flex items-center gap-3">
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

       
      </form>
      )}
    </PageLayout>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600">
        {icon}
      </span>
      <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
    </div>
  );
}
