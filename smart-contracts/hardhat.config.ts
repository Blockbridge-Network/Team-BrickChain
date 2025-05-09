import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

function copyAbiFiles(): void {
  const sourceDir = path.join(__dirname, "artifacts/contracts");
  const destDir = path.join(__dirname, "../src/contracts/abis");

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const contractNames = [
    "PropertyRegistry",
    "FractionalOwnership",
    "AssetMarketplace",
    "InvestmentManager",
    "BCTToken"
  ];

  for (const contractName of contractNames) {
    const sourcePath = path.join(sourceDir, `${contractName}.sol/${contractName}.json`);
    const destPath = path.join(destDir, `${contractName}.json`);

    if (fs.existsSync(sourcePath)) {
      const artifactContent = fs.readFileSync(sourcePath, "utf8");
      const artifact = JSON.parse(artifactContent);
      const minimalArtifact = {
        abi: artifact.abi,
        bytecode: artifact.bytecode
      };
      fs.writeFileSync(
        destPath,
        JSON.stringify(minimalArtifact, null, 2)
      );
    }
  }
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sonicBlaze: {
      url: "https://rpc.blaze.soniclabs.com",
      chainId: 57054,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;
