import { useState, useCallback } from 'react';

export interface LocationData {
  pincode: string;
  city?: string;
  state?: string;
  country?: string;
}

export function usePincodeLookup() {
  const [loadingPincode, setLoadingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  const lookupPincode = useCallback(async (
    pincode: string,
    onSuccess: (location: LocationData) => void,
    onError?: (error: string) => void
  ) => {
    // Only fetch if 6 digits
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeError('');
      return;
    }

    setLoadingPincode(true);
    setPincodeError('');

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      
      if (data && data[0] && data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        onSuccess({
          pincode,
          city: postOffice.District || postOffice.Block,
          state: postOffice.State,
          country: postOffice.Country || 'India',
        });
      } else {
        const errorMsg = 'Pincode not found or invalid.';
        setPincodeError(errorMsg);
        if (onError) onError(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = 'Failed to fetch pincode details.';
      setPincodeError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setLoadingPincode(false);
    }
  }, []);

  return { lookupPincode, loadingPincode, pincodeError };
}
