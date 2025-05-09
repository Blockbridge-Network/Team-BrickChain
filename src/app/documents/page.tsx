'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/listing/steps/FileUploader';
// import { Checkbox } from '@/components/ui/checkbox';

interface FileWithIpfs extends File {
  ipfsUri?: string;
}

interface Document {
  type: string;
  required: boolean;
  description: string;
  files: FileWithIpfs[];
}

export default function DocumentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [documents, setDocuments] = useState<Record<string, Document>>({
    'property-title': {
      type: 'Property Title',
      required: true,
      description: 'Official property title deed or certificate of ownership',
      files: []
    },
    'tax-records': {
      type: 'Tax Records',
      required: true,
      description: 'Property tax records for the last 2 years',
      files: []
    },
    'valuation-report': {
      type: 'Valuation Report',
      required: true,
      description: 'Recent professional property valuation report',
      files: []
    },
    'inspection-report': {
      type: 'Inspection Report',
      required: true,
      description: 'Recent property inspection report',
      files: []
    },
    'insurance': {
      type: 'Insurance Documents',
      required: true,
      description: 'Current property insurance documentation',
      files: []
    },
    'floor-plans': {
      type: 'Floor Plans',
      required: false,
      description: 'Detailed floor plans and architectural drawings',
      files: []
    },
    'photos': {
      type: 'Property Photos',
      required: true,
      description: 'High-quality photos of interior and exterior',
      files: []
    },
    'rental-agreements': {
      type: 'Rental Agreements',
      required: false,
      description: 'Current rental agreements (if applicable)',
      files: []
    }
  });

  const handleFileChange = (docKey: string, files: FileWithIpfs[]) => {
    setDocuments(prev => ({
      ...prev,
      [docKey]: {
        ...prev[docKey],
        files
      }
    }));
  };

  const isFormComplete = () => {
    return Object.values(documents).every(doc => 
      !doc.required || doc.files.length > 0
    ) && termsAccepted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload documents to IPFS and store references
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/list');
    } catch (error) {
      console.error('Document submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Property Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(documents).map(([key, doc]) => (
                  <div key={key} className="space-y-4">
                    <div>
                      <label className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {doc.type}
                          {doc.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                      </label>
                      <p className="text-sm text-gray-400 mb-2">{doc.description}</p>
                      <FileUploader
                        label={`Upload ${doc.type}`}
                        description="Supported formats: PDF, JPG, PNG"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple={true}
                        files={doc.files}
                        onFilesChange={files => handleFileChange(key, files)}
                        maxFiles={5}
                        maxSize={10485760} // 10MB
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  {/* <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  /> */}
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Terms and Conditions
                    </label>
                    <p className="text-sm text-gray-400">
                      I confirm that all submitted documents are genuine and accurate. I understand that 
                      providing false information may result in legal consequences.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !isFormComplete()}
                >
                  {loading ? 'Uploading Documents...' : 'Submit Documents'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}