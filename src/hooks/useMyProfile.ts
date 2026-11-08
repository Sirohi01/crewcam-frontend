'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  DetailsSection,
  MyDetails,
  getMyBankDetails,
  getMyDetails,
  getMyProfile,
  saveMyDetailsSection,
  updateMyProfile,
} from '@/services/meService';

const KEYS = {
  profile: ['me', 'profile'] as const,
  details: ['me', 'details'] as const,
  bank: ['me', 'bank'] as const,
};

const errorMessage = (err: any, fallback: string) => err?.response?.data?.message || fallback;

export function useMyProfile() {
  return useQuery({ queryKey: KEYS.profile, queryFn: getMyProfile, staleTime: 60 * 1000 });
}

export function useMyDetails() {
  return useQuery({ queryKey: KEYS.details, queryFn: getMyDetails, staleTime: 60 * 1000 });
}

export function useMyBankDetails() {
  return useQuery({ queryKey: KEYS.bank, queryFn: getMyBankDetails, staleTime: 5 * 60 * 1000 });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(KEYS.profile, profile);
      toast.success('Profile updated');
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not update profile')),
  });
}

/** Saves one section of /me/details (the whole list) and refreshes the cache from the response. */
export function useSaveMyDetailsSection<S extends DetailsSection>(section: S, successMessage = 'Saved') {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: MyDetails[S]) => saveMyDetailsSection(section, value),
    onSuccess: (details) => {
      queryClient.setQueryData(KEYS.details, details);
      toast.success(successMessage);
    },
    onError: (err) => toast.error(errorMessage(err, 'Could not save changes')),
  });
}
