'use client';

import { useState } from 'react';
import { useContract, useContractWrite } from 'thirdweb/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

interface TokenizationFormProps {
  propertyId: string;
  price: number;
  onSuccess: () => void;
}

export default function TokenizationForm({ propertyId, price, onSuccess }: TokenizationFormProps) {
  const [loading, setLoading] = useState(false);
  const { contract } = useContract("YOUR_CONTRACT_ADDRESS"); // Replace with your deployed contract address
  const { mutateAsync: tokenizeProperty } = useContractWrite(contract, "tokenizeProperty");

  const handleTokenize = async () => {
    try {
      setLoading(true);

      // Call smart contract to tokenize the property
      const tokenizationResult = await tokenizeProperty({
        args: [propertyId, price],
      });

      // Update property status in Supabase
      const supabase = createClient();
      const { error } = await supabase
        .from('properties')
        .update({
          status: 'tokenized',
          contract_address: tokenizationResult.receipt.contractAddress,
        })
        .eq('id', propertyId);

      if (error) throw error;

      onSuccess();
    } catch (error) {
      console.error('Error tokenizing property:', error);
      alert('Failed to tokenize property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tokenize Property</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-400">
          Tokenizing your property will create a smart contract and mint tokens representing ownership shares.
        </p>
        <Button
          onClick={handleTokenize}
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Tokenizing...' : 'Tokenize Property'}
        </Button>
      </CardContent>
    </Card>
  );
}
