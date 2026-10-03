import React, { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

export type ApiSelectType = 'department' | 'employee' | 'branch' | 'business-unit' | 'designation' | 'manpower-request';

interface ApiSearchableSelectProps {
  apiType: ApiSelectType;
  value: string;
  onChange: (value: string) => void;
  onLabelChange?: (label: string) => void;
  placeholder?: string;
  className?: string;
}

const getArray = (res: any) => (Array.isArray(res?.data) ? res.data : res?.data?.data || []);

const apiConfigs = {
  department: {
    key: ['departments'],
    url: '/companies/departments',
    filter: (d: any) => d.isActive !== false,
    label: (d: any) => d.name,
    value: (d: any) => d._id,
  },
  employee: {
    key: ['employees'],
    url: '/employees',
    filter: (e: any) => e.isActive !== false,
    label: (e: any) => `${e.firstName} ${e.lastName}`,
    value: (e: any) => e._id,
  },
  branch: {
    key: ['branches'],
    url: '/companies/branches',
    filter: (b: any) => b.isActive !== false,
    label: (b: any) => b.name,
    value: (b: any) => b._id,
  },
  'business-unit': {
    key: ['business-units'],
    url: '/business-units',
    filter: (b: any) => b.status === 'Active',
    label: (b: any) => b.name,
    value: (b: any) => b.name,
  },
  designation: {
    key: ['designations'],
    url: '/designations',
    filter: (d: any) => d.isActive !== false,
    label: (d: any) => d.name,
    value: (d: any) => d._id,
  },
  'manpower-request': {
    key: ['manpower-requests'],
    url: '/hiring/manpower-request',
    filter: (m: any) => m.status === 'Approved',
    label: (m: any) => `${m.jobCode || ''} ${m.designationId?.name || m.jobTitle}`,
    value: (m: any) => m._id,
  },
};

export function ApiSearchableSelect({ apiType, value, onChange, onLabelChange, placeholder = "Select...", className = '' }: ApiSearchableSelectProps) {
  const config = apiConfigs[apiType];

  const { data: response, isLoading } = useQuery({
    queryKey: config.key,
    queryFn: () => api.get(config.url),
  });

  const options = useMemo(() => {
    if (!response) return [];
    return getArray(response).filter(config.filter).map((item: any) => ({
      label: config.label(item),
      value: config.value(item)
    }));
  }, [response, config]);

  const handleChange = (val: string) => {
    onChange(val);
    if (onLabelChange) {
      const selectedOpt = options.find((o: any) => o.value === val);
      onLabelChange(selectedOpt ? selectedOpt.label : '');
    }
  };

  useEffect(() => {
    if (onLabelChange && value && options.length > 0) {
      const selectedOpt = options.find((o: any) => o.value === value);
      if (selectedOpt) {
        onLabelChange(selectedOpt.label);
      }
    }
  }, [value, options]); // intentionally omit onLabelChange to prevent loop

  return (
    <SearchableDropdown
      options={options}
      value={value}
      onChange={handleChange}
      placeholder={isLoading ? "Loading..." : placeholder}
      className={className}
    />
  );
}
