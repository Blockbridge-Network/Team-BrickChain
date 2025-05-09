import { expect } from "chai";
import { PinataClient } from "../utils/pinata";
import * as fs from "fs";
import * as path from "path";

describe("Pinata IPFS Integration", function() {
  let pinataClient: PinataClient;

  before(async () => {
    pinataClient = new PinataClient();
  });

  it("should successfully authenticate with Pinata", async function() {
    const isAuthenticated = await pinataClient.testAuthentication();
    expect(isAuthenticated).to.be.true;
  });

  it("should successfully upload JSON to IPFS", async function() {
    const testData = {
      name: "Test Property",
      description: "Test Description",
      location: "Test Location",
      timestamp: Date.now()
    };

    const result = await pinataClient.pinJSONToIPFS(testData);    expect(result).to.have.property("IpfsHash");
    expect(result.IpfsHash).to.be.a("string");
    expect(result.IpfsHash).to.have.length.greaterThan(0);

    // Verify we can get a gateway URL
    const gatewayUrl = pinataClient.getIPFSGatewayURL(result.IpfsHash);
    expect(gatewayUrl).to.include(result.IpfsHash);
  });
});
