'use client';

import { useState } from 'react';
import { useContract, useContractWrite } from 'thirdweb/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';

interface InvestmentFormProps {
  propertyId: string;
  tokenPrice: number;
  availableTokens: number;
  onSuccess: () => void;
}

export default function InvestmentForm({
  propertyId,
  tokenPrice,
  availableTokens,
  onSuccess
}: InvestmentFormProps) {
  const [numTokens, setNumTokens] = useState(1);
  const [loading, setLoading] = useState(false);
  const { contract } = useContract("YOUR_CONTRACT_ADDRESS"); // Replace with your deployed contract address
  const { mutateAsync: invest } = useContractWrite(contract, "invest");

  const totalInvestment = numTokens * tokenPrice;

  const handleInvest = async () => {
    if (numTokens <= 0 || numTokens > availableTokens) {
      alert('Invalid number of tokens');
      return;
    }

    try {
      setLoading(true);

      // Call smart contract to make investment
      const investmentResult = await invest({
        args: [propertyId, numTokens],
        value: totalInvestment, // This will be in wei
      });

      // Update property's sold tokens in Supabase
      const supabase = createClient();
      const { error } = await supabase
        .from('properties')
        .update({
          sold_tokens: availableTokens - numTokens
        })
        .eq('id', propertyId);

      if (error) throw error;

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          property_id: propertyId,
          investor_address: investmentResult.receipt.from,
          num_tokens: numTokens,
          total_amount: totalInvestment,
          transaction_hash: investmentResult.receipt.transactionHash,
          status: 'completed'
        }]);

      if (transactionError) throw transactionError;

      onSuccess();
    } catch (error) {
      console.error('Error making investment:', error);
      alert('Failed to complete investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invest in Property</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Number of Tokens</label>
          <Input
            type="number"
            min="1"
            max={availableTokens}
            value={numTokens}
            onChange={(e) => setNumTokens(parseInt(e.target.value) || 0)}
          />
          <p className="text-sm text-gray-400">
            {availableTokens} tokens available at {formatCurrency(tokenPrice)} each
          </p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>Investment Amount</span>
            <span>{formatCurrency(totalInvestment)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Token Price</span>
            <span>{formatCurrency(tokenPrice)} × {numTokens}</span>
          </div>
        </div>

        <Button
          onClick={handleInvest}
          className="w-full"
          disabled={loading || numTokens <= 0 || numTokens > availableTokens}
        >
          {loading ? 'Processing...' : `Invest ${formatCurrency(totalInvestment)}`}
        </Button>

        <p className="text-sm text-gray-400 text-center">
          Your tokens will be minted and transferred to your wallet after the transaction is confirmed
        </p>
      </CardContent>
    </Card>
  );
}
