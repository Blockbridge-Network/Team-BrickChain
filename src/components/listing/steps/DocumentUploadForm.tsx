"use client";

import { useState } from 'react';
import { FileUploader } from './FileUploader';

import { DocumentsForm } from '@/lib/types/listing';

interface DocumentUploadFormProps {
  data: DocumentsForm;
  onUpdate: (data: Partial<DocumentsForm>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function DocumentUploadForm({ data, onUpdate, onNext, onPrevious }: DocumentUploadFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (data.propertyImages.length === 0) {
      newErrors.propertyImages = 'At least one property image is required';
    }
    if (data.legalDocuments.length === 0) {
      newErrors.legalDocuments = 'Required legal documents must be uploaded';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Property Images */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Property Images</h3>
        <FileUploader
          label="Upload Property Images"
          description="Upload high-quality images of your property. Include exterior and interior shots."
          accept="image/*"
          multiple={true}
          files={data.propertyImages}
          onFilesChange={(files) => onUpdate({ propertyImages: files })}
          maxFiles={10}
          maxSize={5242880} // 5MB
        />
        {errors.propertyImages && (
          <p className="mt-2 text-sm text-red-500">{errors.propertyImages}</p>
        )}
      </div>

      {/* Legal Documents */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Legal Documents</h3>
        <FileUploader
          label="Upload Legal Documents"
          description="Upload property deed, title documents, and other legal certificates."
          accept=".pdf,.doc,.docx"
          multiple={true}
          files={data.legalDocuments}
          onFilesChange={(files) => onUpdate({ legalDocuments: files })}
          maxFiles={5}
          maxSize={10485760} // 10MB
        />
        {errors.legalDocuments && (
          <p className="mt-2 text-sm text-red-500">{errors.legalDocuments}</p>
        )}
      </div>

      {/* Additional Certificates */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Additional Certificates</h3>
        <FileUploader
          label="Upload Additional Certificates"
          description="Upload any additional certificates or documents (optional)."
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          multiple={true}
          files={data.certificates}
          onFilesChange={(files) => onUpdate({ certificates: files })}
          maxFiles={5}
          maxSize={5242880} // 5MB
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
