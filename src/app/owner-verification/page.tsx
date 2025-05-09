'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/listing/steps/FileUploader';

interface FileWithIpfs extends File {
  ipfsUri?: string;
}

export default function OwnerVerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    registrationNumber: '',
    taxId: '',
    ownershipDocuments: [] as FileWithIpfs[],
    businessDocuments: [] as FileWithIpfs[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate document verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/property-assessment');
    } catch (error) {
      console.error('Verification submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Property Owner Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Full Legal Name</label>
                      <Input
                        value={formData.fullName}
                        onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Company Name (if applicable)</label>
                      <Input
                        value={formData.companyName}
                        onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Business Registration Number</label>
                      <Input
                        value={formData.registrationNumber}
                        onChange={e => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Tax ID / VAT Number</label>
                      <Input
                        value={formData.taxId}
                        onChange={e => setFormData(prev => ({ ...prev, taxId: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="button" onClick={() => setStep(2)} className="w-full">
                      Next
                    </Button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium block mb-2">Property Ownership Documents</label>
                      <FileUploader
                        label="Upload Ownership Documents"
                        description="Upload property deeds, titles, or proof of ownership"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple={true}
                        files={formData.ownershipDocuments}
                        onFilesChange={files => setFormData(prev => ({ ...prev, ownershipDocuments: files }))}
                        maxFiles={5}
                        maxSize={10485760} // 10MB
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Business Documents</label>
                      <FileUploader
                        label="Upload Business Documents"
                        description="Upload business registration, licenses, and tax documents"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple={true}
                        files={formData.businessDocuments}
                        onFilesChange={files => setFormData(prev => ({ ...prev, businessDocuments: files }))}
                        maxFiles={5}
                        maxSize={10485760} // 10MB
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={loading}>
                        {loading ? 'Verifying...' : 'Submit for Verification'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}