import { pinata } from '../lib/pinata';

async function testPinataConnection() {
  try {
    // Create a simple test file
    const testData = JSON.stringify({ test: 'Hello BrickEarn!' });
    const blob = new Blob([testData], { type: 'application/json' });
    const testFile = new File([blob], 'test.json', { type: 'application/json' });

    console.log('Testing Pinata IPFS connection...');

    // Try to upload the test file
    const ipfsUrl = await pinata.uploadFile(testFile, { test: true });
    console.log('✅ Successfully uploaded test file to IPFS');
    console.log('IPFS URL:', ipfsUrl);

    // Try to fetch the file to verify it's accessible
    const response = await fetch(ipfsUrl);
    if (response.ok) {
      console.log('✅ Successfully verified file accessibility');
    }

    console.log('All tests passed! Pinata IPFS connection is working correctly.');
  } catch (error) {
    console.error('❌ Error testing Pinata connection:', error);
    throw error;
  }
}

testPinataConnection().catch(console.error);
