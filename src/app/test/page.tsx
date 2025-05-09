"use client";

import { useEffect, useState } from 'react';
import { testStorageAndDatabase } from '@/lib/test-setup';
import { testDatabasePolicies } from '@/lib/test-policies';

export default function TestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const runTest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test storage and basic database connection
      const storageResult = await testStorageAndDatabase();
      
      // Test database policies
      const policiesResult = await testDatabasePolicies();
      
      setTestResult({
        ...storageResult,
        policies: policiesResult
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">BrickChain Setup Test</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Integration Tests</h2>
            <button
              onClick={runTest}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Running Tests..." : "Run Tests"}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 p-4 rounded-lg">
              <h3 className="text-red-400 font-semibold mb-2">Error</h3>
              <pre className="text-sm text-red-300 whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {testResult && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Test Results</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-purple-400 mb-2">Overall Status</h4>
                  <p className={testResult.success ? "text-green-400" : "text-red-400"}>
                    {testResult.success ? "✅ All tests passed" : "❌ Tests failed"}
                  </p>
                </div>

                {testResult.thirdwebUri && (
                  <div>
                    <h4 className="text-purple-400 mb-2">Thirdweb Storage Test</h4>
                    <p className="text-green-400">✅ Successfully uploaded test file</p>
                    <p className="text-sm text-gray-400 mt-1">URI: {testResult.thirdwebUri}</p>
                  </div>
                )}

                {testResult.supabaseData && (
                  <div>
                    <h4 className="text-purple-400 mb-2">Supabase Connection Test</h4>
                    <p className="text-green-400">✅ Successfully connected to database</p>
                    <div className="mt-2 bg-gray-900 p-4 rounded">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                        {JSON.stringify(testResult.supabaseData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
