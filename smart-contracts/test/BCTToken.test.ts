import { expect } from "chai";
import "@nomicfoundation/hardhat-chai-matchers";
import { ethers } from "hardhat";
import { BCTToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";


describe("BCTToken", function () {
  let bctToken: BCTToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  const tokenCap = ethers.parseEther("1000000000"); // 1B tokens

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const BCTToken = await ethers.getContractFactory("BCTToken");
    bctToken = await BCTToken.deploy(tokenCap);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await bctToken.hasRole(await bctToken.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await bctToken.balanceOf(owner.address);
      expect(await bctToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the correct token name and symbol", async function () {
      expect(await bctToken.name()).to.equal("BrickToken");
      expect(await bctToken.symbol()).to.equal("$BCN");
    });

    it("Should set the correct cap", async function () {
      expect(await bctToken.cap()).to.equal(tokenCap);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Mint some tokens to owner
      await bctToken.mint(owner.address, ethers.parseEther("50"));
      
      // Transfer 50 tokens from owner to addr1
      await bctToken.transfer(addr1.address, ethers.parseEther("50"));
      const addr1Balance = await bctToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.parseEther("50"));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await bctToken.balanceOf(owner.address);
      await expect(
        bctToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      expect(await bctToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Role-based access control", function () {
    it("Should allow owner to mint tokens", async function () {
      await bctToken.mint(addr1.address, ethers.parseEther("100"));
      expect(await bctToken.balanceOf(addr1.address)).to.equal(ethers.parseEther("100"));
    });

    it("Should not allow non-minters to mint tokens", async function () {
      await expect(
        bctToken.connect(addr1).mint(addr2.address, ethers.parseEther("100"))
      ).to.be.reverted;
    });
  });

  describe("Transfer delay", function () {
    it("Should enforce transfer delay between transactions", async function () {
      // Mint tokens to addr1
      await bctToken.mint(addr1.address, ethers.parseEther("100"));

      // First transfer should work
      await bctToken.connect(addr1).transfer(addr2.address, ethers.parseEther("10"));

      // Second immediate transfer should fail
      await expect(
        bctToken.connect(addr1).transfer(addr2.address, ethers.parseEther("10"))
      ).to.be.revertedWithCustomError(bctToken, "TransferDelayNotMet");
    });
  });
});
