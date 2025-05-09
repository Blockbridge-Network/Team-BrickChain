'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUploader } from '@/components/listing/steps/FileUploader';

export default function KycPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    identityDocument: null as File | null,
    proofOfAddress: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate KYC verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/preferences');
    } catch (error) {
      console.error('KYC verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Identity Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Full Name</label>
                      <Input
                        type="text"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Date of Birth</label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Nationality</label>
                      <Input
                        type="text"
                        value={formData.nationality}
                        onChange={e => setFormData({ ...formData, nationality: e.target.value })}
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
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Residential Address</label>
                      <Input
                        type="text"
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Identity Document</label>
                      <FileUploader
                        label="Upload ID Document"
                        description="Upload a valid government-issued ID (passport, driver's license)"
                        accept=".jpg,.jpeg,.png,.pdf"
                        multiple={false}
                        files={formData.identityDocument ? [formData.identityDocument] : []}
                        onFilesChange={files => setFormData({ ...formData, identityDocument: files[0] || null })}
                        maxFiles={1}
                        maxSize={5242880} // 5MB
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Proof of Address</label>
                      <FileUploader
                        label="Upload Proof of Address"
                        description="Upload a recent utility bill or bank statement (less than 3 months old)"
                        accept=".jpg,.jpeg,.png,.pdf"
                        multiple={false}
                        files={formData.proofOfAddress ? [formData.proofOfAddress] : []}
                        onFilesChange={files => setFormData({ ...formData, proofOfAddress: files[0] || null })}
                        maxFiles={1}
                        maxSize={5242880} // 5MB
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={loading}>
                        {loading ? 'Verifying...' : 'Submit Verification'}
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
