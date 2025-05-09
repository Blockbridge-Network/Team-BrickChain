import { FileWithIpfs } from '@/components/listing/steps/FileUploader';

export interface PropertyDetailsForm {
  title: string;
  type: string;
  location: string;
  city: string;
  state: string;
  country: string;
  description: string;
  size: string;
  yearBuilt: string;
  amenities: string[];
  price: string;
}

export interface DocumentsForm {
  propertyImages: FileWithIpfs[];
  legalDocuments: FileWithIpfs[];
  certificates: FileWithIpfs[];
}

export interface TokenizationForm {
  ownershipType: 'FULL' | 'FRACTIONAL';
  totalTokens: number;
  pricePerToken: string;
  minInvestment: string;
  tradingDelay: string;
  platformFee: number;
  bctDiscountFee: number;
  fees: {
    platformFee: number;
    bctDiscountFee: number;
  };
}

export interface ListingFormData {
  propertyDetails: PropertyDetailsForm;
  documents: DocumentsForm;
  tokenization: TokenizationForm;
}

export interface ListingContextState {
  formData: ListingFormData;
  isLoading: boolean;
  error: string | null;
  updateFormData: (step: string, data: any) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
