import React, { createContext, useContext, useState } from 'react';
import { ListingContextState, ListingFormData } from '@/lib/types/listing';

const defaultFormData: ListingFormData = {
  propertyDetails: {
    title: '',
    type: '',
    location: '',
    city: '',
    state: '',
    country: '',
    description: '',
    size: '',
    yearBuilt: '',
    amenities: [],
    price: '',
  },
  documents: {
    propertyImages: [],
    legalDocuments: [],
    certificates: [],
  },  tokenization: {
    ownershipType: 'FULL',
    totalTokens: 0,
    pricePerToken: '',
    minInvestment: '',
    tradingDelay: '',
    platformFee: 2.5,
    bctDiscountFee: 0.5,
    fees: {
      platformFee: 2.5,
      bctDiscountFee: 0.5,
    }
  },
};

const defaultContext: ListingContextState = {
  formData: defaultFormData,
  isLoading: false,
  error: null,
  updateFormData: () => {},
  setIsLoading: () => {},
  setError: () => {},
};

const ListingContext = createContext<ListingContextState>(defaultContext);

export const ListingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<ListingFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (step: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step as keyof ListingFormData], ...data },
    }));
  };

  return (
    <ListingContext.Provider
      value={{
        formData,
        isLoading,
        error,
        updateFormData,
        setIsLoading,
        setError,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};

export const useListingContext = () => useContext(ListingContext);
