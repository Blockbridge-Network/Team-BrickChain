import { upload } from "thirdweb/storage";
import { useClient } from "../app/client";

export interface PropertyMetadata {
  title: string;
  description: string;
  detailedDescription?: string;
  amenities: string[];
  images: File[];
  documents: File[];
  propertyType: string;
  yearBuilt: string;
  totalArea: number;
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  parkingSpaces?: number;
  constructionStatus?: string;
  legalInformation?: {
    titleDeed?: string;
    permits?: string[];
    restrictions?: string[];
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface StoredPropertyMetadata extends Omit<PropertyMetadata, 'images' | 'documents'> {
  images: string[]; // IPFS URIs
  documents: string[]; // IPFS URIs
  updatedAt: string;
  version: string;
}

export async function uploadPropertyMetadata(
  client: ReturnType<typeof useClient>,
  metadata: PropertyMetadata
): Promise<{ metadataUri: string; imageUris: string[]; documentUris: string[] }> {
  try {
    // First, upload all images
    const imageUris = await upload({
      client,
      files: metadata.images
    });

    // Then upload all documents
    const documentUris = await upload({
      client,
      files: metadata.documents
    });

    // Create the metadata object with IPFS URIs
    const storedMetadata: StoredPropertyMetadata = {
      ...metadata,
      images: Array.isArray(imageUris) ? imageUris : [imageUris],
      documents: Array.isArray(documentUris) ? documentUris : [documentUris],
      updatedAt: new Date().toISOString(),
      version: "1.0"
    };

    // Upload the full metadata to IPFS
    const metadataUri = await upload({
      client,
      files: [{
        name: 'metadata.json',
        data: storedMetadata
      }]
    });

    return {
      metadataUri: Array.isArray(metadataUri) ? metadataUri[0] : metadataUri,
      imageUris: Array.isArray(imageUris) ? imageUris : [imageUris],
      documentUris: Array.isArray(documentUris) ? documentUris : [documentUris]
    };
  } catch (error) {
    console.error('Error uploading property metadata:', error);
    throw error;
  }
}
