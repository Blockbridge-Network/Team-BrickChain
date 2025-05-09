'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAddress } from 'thirdweb/react';
import { client as thirdwebClient } from '@/lib/thirdweb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useDropzone } from 'react-dropzone';

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  price: z.number().positive('Price must be positive'),
  totalTokens: z.number().int().positive('Total tokens must be positive'),
  tokenPrice: z.number().positive('Token price must be positive'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function PropertyListingForm() {
  const router = useRouter();
  const address = useAddress();
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 5,
    onDrop: acceptedFiles => {
      setImages(acceptedFiles);
    }
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      
      // Upload images      // Upload images to IPFS
      // Upload to IPFS using existing ThirdWeb client
      const imageUris = await upload({
        client: thirdwebClient,
        files: images.map(file => ({
          data: file,
          name: file.name
        }))
      });

      // Create property listing
      const { data: property, error } = await supabase
        .from('properties')
        .insert([
          {
            title: data.title,
            description: data.description,
            location: data.location,
            price: data.price,
            total_tokens: data.totalTokens,
            token_price: data.tokenPrice,
            owner_address: address,            status: 'pending',
            images: Array.isArray(imageUris) ? imageUris : [imageUris],
          }
        ])
        .select()
        .single();

      if (error) throw error;

      router.push(`/property/${property.id}`);
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Failed to create property listing');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>List Your Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Property Title</label>
            <Input {...register('title')} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea {...register('description')} rows={4} />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input {...register('location')} />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Property Value (USD)</label>
              <Input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Total Tokens</label>
              <Input
                type="number"
                {...register('totalTokens', { valueAsNumber: true })}
              />
              {errors.totalTokens && (
                <p className="text-sm text-red-500">{errors.totalTokens.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Token Price (USD)</label>
            <Input
              type="number"
              step="0.01"
              {...register('tokenPrice', { valueAsNumber: true })}
            />
            {errors.tokenPrice && (
              <p className="text-sm text-red-500">{errors.tokenPrice.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Property Images</label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
            >
              <input {...getInputProps()} />
              <p>Drag & drop images here, or click to select files</p>
              <p className="text-sm text-gray-500">Maximum 5 images</p>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {images.map((file, index) => (
                  <div key={index} className="relative aspect-video">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={uploading}
          >
            {uploading ? 'Creating Listing...' : 'Create Listing'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
