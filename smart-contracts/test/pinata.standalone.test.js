const { expect } = require('chai');
const { PinataWrapper } = require('../dist/pinata');

describe('Pinata IPFS Integration', function() {  let pinataClient;

  before(async () => {
    pinataClient = new PinataWrapper();
  });

  it('should connect to Pinata and upload JSON', async () => {
    const testData = {
      name: "Test Property",
      description: "Test Description",
      location: "Test Location",
      timestamp: Date.now()
    };

    try {
      const result = await pinataClient.pinJSONToIPFS(testData);
      console.log('IPFS Upload Result:', result);
      
      expect(result).to.have.property('IpfsHash');
      expect(result.IpfsHash).to.be.a('string');
      expect(result.IpfsHash).to.have.length.greaterThan(0);

      const gatewayUrl = pinataClient.getIPFSGatewayURL(result.IpfsHash);
      console.log('Gateway URL:', gatewayUrl);
      expect(gatewayUrl).to.include(result.IpfsHash);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  });
});
