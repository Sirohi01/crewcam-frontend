import React, { forwardRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import api from '@/lib/axios';

export type ApiSelectType = 'department' | 'employee' | 'branch' | 'business-unit' | 'designation';

interface ApiSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  apiType: ApiSelectType;
  placeholderText?: string;
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
    value: (b: any) => b.name, // specifically binds by name based on original implementation
  },
  designation: {
    key: ['designations'],
    url: '/designations',
    filter: (d: any) => d.isActive !== false,
    label: (d: any) => d.name,
    value: (d: any) => d._id,
  },
};

const ApiSelect = forwardRef<HTMLSelectElement, ApiSelectProps>(
  ({ apiType, placeholderText = 'Select option', className, ...props }, ref) => {
    const config = apiConfigs[apiType];

    const { data: response, isLoading } = useQuery({
      queryKey: config.key,
      queryFn: () => api.get(config.url),
    });

    const options = React.useMemo(() => {
      if (!response) return [];
      return getArray(response).filter(config.filter);
    }, [response, config]);

    return (
      <div className="relative">
        <select
          ref={ref}
          className={`appearance-none ${className || ''}`}
          {...props}
        >
          <option value="">{placeholderText}</option>
          {options.map((opt: any) => (
            <option key={opt._id} value={config.value(opt)}>
              {config.label(opt)}
            </option>
          ))}
        </select>
        <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      </div>
    );
  }
);

ApiSelect.displayName = 'ApiSelect';

export default ApiSelect;
