'use client';

import { useEffect, useState } from 'react';
import { useAddress } from 'thirdweb/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, truncateAddress } from '@/lib/utils';

interface Transaction {
  id: string;
  property_id: string;
  investor_address: string;
  num_tokens: number;
  total_amount: number;
  transaction_hash: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  property: {
    title: string;
    token_price: number;
  };
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const address = useAddress();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return;

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            *,
            property:properties (
              title,
              token_price
            )
          `)
          .eq('investor_address', address)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (!address) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-400 py-4">No transactions found</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800 rounded-lg"
              >
                <div className="space-y-1 mb-2 sm:mb-0">
                  <h3 className="font-medium">{tx.property.title}</h3>
                  <p className="text-sm text-gray-400">
                    {tx.num_tokens} tokens at {formatCurrency(tx.property.token_price)} each
                  </p>
                  <a
                    href={`https://etherscan.io/tx/${tx.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    View on Etherscan
                  </a>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(tx.total_amount)}</p>
                  <p className={`text-sm ${
                    tx.status === 'completed' ? 'text-green-400' :
                    tx.status === 'failed' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
