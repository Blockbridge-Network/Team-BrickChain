import { createBrowserClient } from '@supabase/ssr';
import { upload } from "thirdweb/storage";
import { PropertyListing, validatePropertyListing } from './property-types';
import { FileWithIpfs } from '@/components/listing/steps/FileUploader';
import { client } from '@/app/client';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UploadResult {
  url: string;
  hash: string;
}

async function uploadToIPFS(files: FileWithIpfs[]): Promise<string[]> {
  try {
    const uris = await upload({
      client,
      files
    });
    return uris;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload files to IPFS');
  }
}

async function uploadPropertyFiles(
  images: { primary: FileWithIpfs[], gallery: FileWithIpfs[], floorPlan?: FileWithIpfs[] },
  documents: { [key: string]: FileWithIpfs[] }
) {
  const uploadedFiles = {
    images: {
      primary: '',
      gallery: [] as string[],
      floorPlan: undefined as string | undefined
    },
    documents: {
      titleDeed: '',
      valuationReport: undefined as string | undefined,
      structuralReport: undefined as string | undefined,
      propertyInspection: undefined as string | undefined,
      insuranceDocs: undefined as string | undefined,
      additionalDocs: [] as string[]
    }
  };

  // Upload primary image
  if (images.primary.length > 0) {
    const [primaryUri] = await uploadToIPFS(images.primary);
    uploadedFiles.images.primary = primaryUri;
  }

  // Upload gallery images
  if (images.gallery.length > 0) {
    uploadedFiles.images.gallery = await uploadToIPFS(images.gallery);
  }

  // Upload floor plan if exists
  if (images.floorPlan?.length) {
    const [floorPlanUri] = await uploadToIPFS(images.floorPlan);
    uploadedFiles.images.floorPlan = floorPlanUri;
  }

  // Upload documents
  for (const [key, files] of Object.entries(documents)) {
    if (files.length > 0) {
      const [docUri] = await uploadToIPFS(files);
      (uploadedFiles.documents as any)[key] = docUri;
    }
  }

  return uploadedFiles;
}

export async function createPropertyListing(
  listing: Omit<PropertyListing, 'id' | 'createdAt' | 'updatedAt'>,
  files: {
    images: { primary: FileWithIpfs[], gallery: FileWithIpfs[], floorPlan?: FileWithIpfs[] },
    documents: { [key: string]: FileWithIpfs[] }
  }
): Promise<{ success: boolean; error?: string; propertyId?: string }> {
  try {
    // Validate listing data
    const validation = validatePropertyListing(listing as PropertyListing);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') };
    }

    // Upload all files to IPFS
    const uploadedFiles = await uploadPropertyFiles(files.images, files.documents);

    // Create metadata object with file URIs
    const propertyData = {
      ...listing,
      images: uploadedFiles.images,
      documents: uploadedFiles.documents,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save to Supabase
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      propertyId: data.id
    };
  } catch (error) {
    console.error('Error creating property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create property listing'
    };
  }
}

export async function updatePropertyListing(
  id: string,
  updates: Partial<PropertyListing>,
  files?: {
    images?: { primary?: FileWithIpfs[], gallery?: FileWithIpfs[], floorPlan?: FileWithIpfs[] },
    documents?: { [key: string]: FileWithIpfs[] }
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { ...updates, updated_at: new Date().toISOString() };

    // Upload any new files
    if (files) {
      const uploadedFiles = await uploadPropertyFiles(
        {
          primary: files.images?.primary || [],
          gallery: files.images?.gallery || [],
          floorPlan: files.images?.floorPlan
        },
        files.documents || {}
      );

      // Only update image/document fields that have new files
      if (files.images?.primary) updateData.images.primary = uploadedFiles.images.primary;
      if (files.images?.gallery) updateData.images.gallery = uploadedFiles.images.gallery;
      if (files.images?.floorPlan) updateData.images.floorPlan = uploadedFiles.images.floorPlan;
      
      if (files.documents) {
        Object.keys(files.documents).forEach(key => {
          if (key in uploadedFiles.documents && files.documents![key].length > 0) {
            (updateData.documents as any)[key] = uploadedFiles.documents[key as keyof typeof uploadedFiles.documents];
          }
        });
      }
    }

    const { error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating property:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update property listing'
    };
  }
}

export async function getPropertyListing(id: string): Promise<PropertyListing | null> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return data as PropertyListing;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export async function getUserProperties(userId: string): Promise<PropertyListing[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as PropertyListing[];
  } catch (error) {
    console.error('Error fetching user properties:', error);
    return [];
  }
}