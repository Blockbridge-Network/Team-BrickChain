import { expect } from "chai";
import { ethers } from "hardhat";
import { PropertyRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { PinataWrapper } from "../utils/pinata";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { PinataWrapper } from "../utils/pinata";

describe("PropertyRegistry", function () {
  let propertyRegistry: PropertyRegistry;
  let pinata: PinataWrapper;
  let owner: SignerWithAddress;
  let verifier: SignerWithAddress;
  let operator: SignerWithAddress;
  let user: SignerWithAddress;
  const VERIFIER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("VERIFIER_ROLE"));
  const OPERATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("OPERATOR_ROLE"));

  beforeEach(async function () {
    [owner, verifier, operator, user] = await ethers.getSigners();
    
    // Initialize Pinata client
    pinata = PinataWrapper.getInstance();
    
    const PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
    propertyRegistry = await PropertyRegistry.deploy();
    await propertyRegistry.waitForDeployment();

    // Grant roles
    await propertyRegistry.grantRole(VERIFIER_ROLE, verifier.address);
    await propertyRegistry.grantRole(OPERATOR_ROLE, operator.address);
  });

  describe("Property Registration", function () {
    let propertyMetadataHash: string;

    beforeEach(async function () {
      // Create and upload property metadata to IPFS
      const metadata = {
        name: "Test Property",
        description: "A property for testing",
        location: "123 Main St, City",
        size: 1000,
        yearBuilt: 2020,
        images: ["ipfs://image1", "ipfs://image2"],
        documents: {
          title: "ipfs://title-deed",
          survey: "ipfs://survey-report"
        }
      };

      const result = await pinata.pinJSONToIPFS(metadata);
      propertyMetadataHash = result.IpfsHash;
    });

    it("should allow operator to register a property with IPFS metadata", async function () {
      const tokenURI = `ipfs://${propertyMetadataHash}`;
      const location = "123 Main St, City";
      const size = 1000; // 1000 sq meters
      const yearBuilt = 2020;

      await expect(propertyRegistry.connect(operator).registerProperty(
        user.address,
        location,
        size,
        yearBuilt,
        tokenURI
      )).to.emit(propertyRegistry, "PropertyRegistered")
        .withArgs(0, user.address, location);

      const property = await propertyRegistry.properties(0);
      expect(property.tokenURI).to.equal(tokenURI);
    });

    it("should not allow non-operator to register property", async function () {
      const tokenURI = `ipfs://${propertyMetadataHash}`;
      const location = "456 Main St, City";
      const size = 1000;
      const yearBuilt = 2020;

      await expect(propertyRegistry.connect(user).registerProperty(
        user.address,
        location,
        size,
        yearBuilt,
        tokenURI
      )).to.be.revertedWith("AccessControl: account " + user.address.toLowerCase() + " is missing role " + OPERATOR_ROLE);
    });

    it("should prevent duplicate location registration", async function () {
      const location = "789 Main St, City";
      const size = 1000;
      const yearBuilt = 2020;
      const tokenURI = `ipfs://${propertyMetadataHash}`;

      await propertyRegistry.connect(operator).registerProperty(
        user.address,
        location,
        size,
        yearBuilt,
        tokenURI
      );

      await expect(propertyRegistry.connect(operator).registerProperty(
        user.address,
        location,
        size,
        yearBuilt,
        tokenURI
      )).to.be.revertedWith("Location already registered");
    });

    it("should store property metadata correctly", async function () {
      const location = "321 Test St, City";
      const size = 1500;
      const yearBuilt = 2021;
      const tokenURI = `ipfs://${propertyMetadataHash}`;

      await propertyRegistry.connect(operator).registerProperty(
        user.address,
        location,
        size,
        yearBuilt,
        tokenURI
      );

      const property = await propertyRegistry.properties(0);
      expect(property.owner).to.equal(user.address);
      expect(property.location).to.equal(location);
      expect(property.size).to.equal(size);
      expect(property.yearBuilt).to.equal(yearBuilt);
      expect(property.tokenURI).to.equal(tokenURI);
      expect(property.isVerified).to.be.false;
      expect(property.isLocked).to.be.false;
    });
  });

  describe("Property Verification", function () {
    let propertyId: number;

    beforeEach(async function () {
      const metadata = {
        name: "Verification Test Property",
        description: "A property for testing verification",
        location: "123 Verification St, City",
        images: ["ipfs://verify-image1"],
        documents: {
          title: "ipfs://title-verify"
        }
      };

      const result = await pinata.pinJSONToIPFS(metadata);
      const tokenURI = `ipfs://${result.IpfsHash}`;
      const location = "123 Verification St, City";
      const size = 1000;
      const yearBuilt = 2020;

      await propertyRegistry.connect(operator).registerProperty(
        user.address,
        location,
        size,
        yearBuilt,
        tokenURI
      );
      propertyId = 0;
    });

    it("should allow verifier to verify property", async function () {
      await expect(propertyRegistry.connect(verifier).verifyProperty(propertyId))
        .to.emit(propertyRegistry, "PropertyVerified")
        .withArgs(propertyId, verifier.address);

      const property = await propertyRegistry.properties(propertyId);
      expect(property.isVerified).to.be.true;
    });

    it("should not allow non-verifier to verify property", async function () {
      await expect(propertyRegistry.connect(user).verifyProperty(propertyId))
        .to.be.revertedWith("AccessControl: account " + user.address.toLowerCase() + " is missing role " + VERIFIER_ROLE);
    });

    it("should not allow verifying non-existent property", async function () {
      const nonExistentId = 999;
      await expect(propertyRegistry.connect(verifier).verifyProperty(nonExistentId))
        .to.be.revertedWith("Property does not exist");
    });
  });

  describe("Property Locking", function () {
    let propertyId: number;

    beforeEach(async function () {
      const metadata = {
        name: "Locking Test Property",
        description: "A property for testing locking mechanism",
        location: "123 Lock St, City",
        images: ["ipfs://lock-image1"],
        documents: {
          title: "ipfs://title-lock"
        }
      };

      const result = await pinata.pinJSONToIPFS(metadata);
      const tokenURI = `ipfs://${result.IpfsHash}`;
      const location = "123 Lock St, City";
      const size = 1000;
      const yearBuilt = 2020;

      await propertyRegistry.connect(operator).registerProperty(
        user.address,
        location,
        size,
        yearBuilt,
        tokenURI
      );
      propertyId = 0;
    });

    it("should allow operator to lock verified property", async function () {
      await propertyRegistry.connect(verifier).verifyProperty(propertyId);

      await expect(propertyRegistry.connect(operator).lockProperty(propertyId))
        .to.emit(propertyRegistry, "PropertyLocked")
        .withArgs(propertyId);

      const property = await propertyRegistry.properties(propertyId);
      expect(property.isLocked).to.be.true;
    });

    it("should not allow locking unverified property", async function () {
      await expect(propertyRegistry.connect(operator).lockProperty(propertyId))
        .to.be.revertedWith("Property not verified");
    });

    it("should allow operator to unlock property", async function () {
      await propertyRegistry.connect(verifier).verifyProperty(propertyId);
      await propertyRegistry.connect(operator).lockProperty(propertyId);
      
      await expect(propertyRegistry.connect(operator).unlockProperty(propertyId))
        .to.emit(propertyRegistry, "PropertyUnlocked")
        .withArgs(propertyId);

      const property = await propertyRegistry.properties(propertyId);
      expect(property.isLocked).to.be.false;
    });

    it("should not allow non-operator to lock/unlock property", async function () {
      await propertyRegistry.connect(verifier).verifyProperty(propertyId);

      await expect(propertyRegistry.connect(user).lockProperty(propertyId))
        .to.be.revertedWith("AccessControl: account " + user.address.toLowerCase() + " is missing role " + OPERATOR_ROLE);

      await propertyRegistry.connect(operator).lockProperty(propertyId);

      await expect(propertyRegistry.connect(user).unlockProperty(propertyId))
        .to.be.revertedWith("AccessControl: account " + user.address.toLowerCase() + " is missing role " + OPERATOR_ROLE);
    });
  });
});