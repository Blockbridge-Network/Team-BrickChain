"use client";

import { useState, useEffect, memo } from 'react';
import PropertyDetailsForm from './steps/PropertyDetailsForm';
import DocumentUploadForm from './steps/DocumentUploadForm';
import TokenizationForm from './steps/TokenizationForm';
import PreviewForm from './steps/PreviewForm';
import { createPropertyListing } from '../../lib/property';
import { getCurrentUser } from '../../lib/user';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { PropertyListing, TokenizationDetails, PropertyMetadata } from '../../lib/property-types';
import { ListingProvider, useListingContext } from './ListingContext';
import { ListingFormData } from '../../lib/types/listing';
import { FileWithIpfs } from './steps/FileUploader';

const steps = [
  { id: 1, title: 'Property Details', description: 'Basic property information' },
  { id: 2, title: 'Documents', description: 'Upload required documents' },
  { id: 3, title: 'Tokenization', description: 'Set tokenization parameters' },
  { id: 4, title: 'Preview & Submit', description: 'Review and submit listing' },
];

const ListingFormContent = memo(function ListingFormContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();
  const { formData, isLoading, error, updateFormData, setIsLoading, setError } = useListingContext();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const user = await getCurrentUser();
        if (!user || !user.id) {
          router.push("/profile?redirect=list");
          return;
        }
        setUserId(user.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user');
        toast.error('Failed to load user information');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [router, setIsLoading, setError]);
  const handleNext = async (sectionData: Partial<ListingFormData[keyof ListingFormData]>) => {
    try {
      // Update the form data first
      switch (currentStep) {
        case 1:
          updateFormData('propertyDetails', sectionData);
          break;
        case 2:
          updateFormData('documents', sectionData);
          break;
        case 3:
          updateFormData('tokenization', sectionData);
          break;
        case 4:
          // Convert form data to property listing format
          const listing: Omit<PropertyListing, 'id' | 'createdAt' | 'updatedAt'> = {
            ownerId: userId,
            title: formData.propertyDetails.title,
            location: {
              address: formData.propertyDetails.location,
              city: formData.propertyDetails.city,
              state: formData.propertyDetails.state,
              country: formData.propertyDetails.country,
            },
            propertyType: formData.propertyDetails.type.toUpperCase() as PropertyListing['propertyType'],
            status: 'PENDING_REVIEW',
            metadata: {
              propertyAddress: formData.propertyDetails.location,
              description: formData.propertyDetails.description,
              amenities: formData.propertyDetails.amenities,
              yearBuilt: parseInt(formData.propertyDetails.yearBuilt),
              totalArea: parseFloat(formData.propertyDetails.size),
            },
            tokenization: {
              ownershipType: formData.tokenization.ownershipType,
              totalTokens: formData.tokenization.totalTokens,
              pricePerToken: parseFloat(formData.tokenization.pricePerToken),
              minimumInvestment: parseFloat(formData.tokenization.minInvestment),
              tradingDelay: parseInt(formData.tokenization.tradingDelay),
              platformFee: formData.tokenization.platformFee,
              bctDiscountRate: formData.tokenization.bctDiscountFee
            },
            price: parseFloat(formData.propertyDetails.price),
            images: {
              primary: '',
              gallery: []
            },
            documents: {
              titleDeed: '',
              additionalDocs: []
            }
          };

          setIsLoading(true);
          const result = await createPropertyListing(listing, {
            images: {
              primary: [formData.documents.propertyImages[0]],
              gallery: formData.documents.propertyImages.slice(1),
            },
            documents: {
              titleDeed: [formData.documents.legalDocuments[0]],
              additionalDocs: [...formData.documents.certificates]
            }
          });

          if (!result.success) {
            throw new Error(result.error);
          }

          toast.success('Property listed successfully!');
          router.push(`/property/${result.propertyId}`);
          return;
      }

      // Move to next step
      setCurrentStep(prev => prev + 1);
      updateFormData(getStepKey(currentStep), sectionData);
      
      if (currentStep < steps.length) {
        setCurrentStep(current => current + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to proceed to next step');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(current => current - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const propertyFiles = {
        images: {
          primary: [formData.documents.propertyImages[0]] as FileWithIpfs[],
          gallery: formData.documents.propertyImages.slice(1) as FileWithIpfs[],
        },
        documents: {
          titleDeed: [formData.documents.legalDocuments[0]] as FileWithIpfs[],
          additionalDocs: [
            ...formData.documents.legalDocuments.slice(1),
            ...formData.documents.certificates
          ] as FileWithIpfs[]
        }
      };

      const metadata: PropertyMetadata = {
        propertyAddress: formData.propertyDetails.location,
        description: formData.propertyDetails.description,
        amenities: formData.propertyDetails.amenities,
        yearBuilt: parseInt(formData.propertyDetails.yearBuilt),
        totalArea: parseFloat(formData.propertyDetails.size)
      };

      const tokenization: TokenizationDetails = {
        ownershipType: formData.tokenization.ownershipType,
        totalTokens: formData.tokenization.totalTokens,
        pricePerToken: parseFloat(formData.tokenization.pricePerToken),
        minimumInvestment: parseFloat(formData.tokenization.minInvestment),
        tradingDelay: parseInt(formData.tokenization.tradingDelay),
        platformFee: formData.tokenization.platformFee,
        bctDiscountRate: formData.tokenization.bctDiscountFee
      };

      const listing: PropertyListing = {
        ownerId: userId,
        title: formData.propertyDetails.title,
        propertyType: formData.propertyDetails.type.toUpperCase() as PropertyListing['propertyType'],
        location: {
          address: formData.propertyDetails.location,
          city: formData.propertyDetails.city,
          state: formData.propertyDetails.state,
          country: formData.propertyDetails.country,
        },
        price: parseFloat(formData.propertyDetails.price),
        status: 'DRAFT',
        metadata,
        tokenization,
        images: {
          primary: propertyFiles.images.primary[0].ipfsUri || '',
          gallery: propertyFiles.images.gallery.map(img => img.ipfsUri || '')
        },
        documents: {
          titleDeed: propertyFiles.documents.titleDeed[0].ipfsUri || '',
          additionalDocs: propertyFiles.documents.additionalDocs.map(doc => doc.ipfsUri || '')
        }
      };

      await createPropertyListing(listing, propertyFiles);
      toast.success('Property listing created successfully!');
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
      toast.error('Failed to create property listing');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepKey = (step: number): keyof ListingFormData => {
    switch (step) {
      case 1: return 'propertyDetails';
      case 2: return 'documents';
      case 3: return 'tokenization';
      default: return 'propertyDetails';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex-1 text-center ${
                step.id === currentStep
                  ? 'text-primary font-bold'
                  : step.id < currentStep
                  ? 'text-gray-500'
                  : 'text-gray-300'
              }`}
            >
              <div className="mb-2">{step.title}</div>
              <div className="text-sm">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {currentStep === 1 && (
          <PropertyDetailsForm
            data={formData.propertyDetails}
            onUpdate={handleNext}
            onNext={() => {}}
          />
        )}
        {currentStep === 2 && (
          <DocumentUploadForm
            data={formData.documents}
            onUpdate={handleNext}
            onNext={() => {}}
            onPrevious={handleBack}
          />
        )}
        {currentStep === 3 && (
          <TokenizationForm
            data={formData.tokenization}
            onUpdate={handleNext}
            onNext={() => {}}
            onPrevious={handleBack}
          />
        )}
        {currentStep === 4 && (
          <PreviewForm
            formData={formData}
            onSubmit={handleSubmit}
            onPrevious={handleBack}
          />
        )}
      </div>
    </div>
  );
});

export default function ListingForm() {
  return (
    <ListingProvider>
      <ListingFormContent />
    </ListingProvider>
  );
}
