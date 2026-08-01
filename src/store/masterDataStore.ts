import { create } from 'zustand';
import api from '@/lib/axios';

export interface MasterDataItem {
  _id?: string;
  id?: string | number;
  name?: string;
  firstName?: string;
  lastName?: string;
  code?: string;
  title?: string;
  [key: string]: any;
}

interface MasterDataState {
  departments: MasterDataItem[];
  designations: MasterDataItem[];
  locations: MasterDataItem[];
  categories: MasterDataItem[];
  subCategories: MasterDataItem[];
  employees: MasterDataItem[];
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  fetchMasterData: () => Promise<void>;
}

export const useMasterDataStore = create<MasterDataState>((set, get) => ({
  departments: [],
  designations: [],
  locations: [],
  categories: [],
  subCategories: [],
  employees: [],
  isLoaded: false,
  isLoading: false,
  error: null,

  fetchMasterData: async () => {
    const { isLoaded, isLoading } = get();
    
    if (isLoaded || isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const [
        departmentsRes,
        designationsRes,
        locationsRes,
        categoriesRes,
        employeesRes
      ] = await Promise.allSettled([
        api.get('/companies/departments'),
        api.get('/designations'),
        api.get('/locations'),
        api.get('/policies'), // Master policies/categories
        api.get('/employees')
      ]);

      const getPayload = (res: PromiseSettledResult<any>) => 
        res.status === 'fulfilled' ? (res.value.data?.data || res.value.data || []) : [];

      set({
        departments: getPayload(departmentsRes),
        designations: getPayload(designationsRes),
        locations: getPayload(locationsRes),
        categories: getPayload(categoriesRes),
        employees: getPayload(employeesRes),
        subCategories: [], 
        isLoaded: true,
      });
    } catch (error: any) {
      console.error('Failed to fetch master data:', error);
      set({ error: error.message || 'Failed to load data' });
    } finally {
      set({ isLoading: false });
    }
  }
}));
