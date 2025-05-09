import { ethers } from "hardhat";
import { Contract, ContractTransactionResponse } from "ethers";
import fs from "fs";
import path from "path";
import {
  BCTToken,
  PropertyRegistry,
  FractionalOwnership,
  AssetMarketplace,
  InvestmentManager,
} from "../typechain-types";

type DeployedContract<T> = T & {
  waitForDeployment(): Promise<void>;
  getAddress(): Promise<string>;
};

interface DeployedContracts {
  BCTToken: DeployedContract<BCTToken>;
  PropertyRegistry: DeployedContract<PropertyRegistry>;
  FractionalOwnership: DeployedContract<FractionalOwnership>;
  AssetMarketplace: DeployedContract<AssetMarketplace>;
  InvestmentManager: DeployedContract<InvestmentManager>;
}

async function main() {
  console.log("Starting deployment process...");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const contracts = {} as DeployedContracts;

  try {
    // 1. Deploy BCTToken
    console.log("\nDeploying BCTToken...");
    const BCTTokenFactory = await ethers.getContractFactory("BCTToken");
    contracts.BCTToken = await BCTTokenFactory.deploy() as DeployedContract<BCTToken>;
    await contracts.BCTToken.waitForDeployment();
    console.log("BCTToken deployed to:", await contracts.BCTToken.getAddress());

    // 2. Deploy PropertyRegistry
    console.log("\nDeploying PropertyRegistry...");
    const PropertyRegistryFactory = await ethers.getContractFactory("PropertyRegistry");
    contracts.PropertyRegistry = await PropertyRegistryFactory.deploy() as DeployedContract<PropertyRegistry>;
    await contracts.PropertyRegistry.waitForDeployment();
    console.log("PropertyRegistry deployed to:", await contracts.PropertyRegistry.getAddress());

    // 3. Deploy FractionalOwnership with PropertyRegistry address and token details
    console.log("\nDeploying FractionalOwnership...");
    const FractionalOwnershipFactory = await ethers.getContractFactory("FractionalOwnership");
    contracts.FractionalOwnership = await FractionalOwnershipFactory.deploy(
      await contracts.PropertyRegistry.getAddress(),
      "BrickEarn Property Share",
      "BEPS"
    ) as DeployedContract<FractionalOwnership>;
    await contracts.FractionalOwnership.waitForDeployment();
    console.log("FractionalOwnership deployed to:", await contracts.FractionalOwnership.getAddress());

    // 4. Deploy AssetMarketplace
    console.log("\nDeploying AssetMarketplace...");
    const AssetMarketplaceFactory = await ethers.getContractFactory("AssetMarketplace");
    contracts.AssetMarketplace = await AssetMarketplaceFactory.deploy(
      await contracts.FractionalOwnership.getAddress(),
      await contracts.BCTToken.getAddress()
    ) as DeployedContract<AssetMarketplace>;
    await contracts.AssetMarketplace.waitForDeployment();
    console.log("AssetMarketplace deployed to:", await contracts.AssetMarketplace.getAddress());

    // 5. Deploy InvestmentManager
    console.log("\nDeploying InvestmentManager...");
    const InvestmentManagerFactory = await ethers.getContractFactory("InvestmentManager");
    contracts.InvestmentManager = await InvestmentManagerFactory.deploy(
      await contracts.PropertyRegistry.getAddress(),
      await contracts.FractionalOwnership.getAddress()
    ) as DeployedContract<InvestmentManager>;
    await contracts.InvestmentManager.waitForDeployment();
    console.log("InvestmentManager deployed to:", await contracts.InvestmentManager.getAddress());

    // Setup roles and permissions
    console.log("\nSetting up roles and permissions...");
    
    // Grant roles to contracts
    const operatorRole = await contracts.FractionalOwnership.OPERATOR_ROLE();
    
    await contracts.FractionalOwnership.grantRole(
      operatorRole,
      await contracts.AssetMarketplace.getAddress()
    );
    
    await contracts.FractionalOwnership.grantRole(
      operatorRole,
      await contracts.InvestmentManager.getAddress()
    );

    // Save deployment addresses
    const deploymentAddresses = {
      BCTToken: await contracts.BCTToken.getAddress(),
      PropertyRegistry: await contracts.PropertyRegistry.getAddress(),
      FractionalOwnership: await contracts.FractionalOwnership.getAddress(),
      AssetMarketplace: await contracts.AssetMarketplace.getAddress(),
      InvestmentManager: await contracts.InvestmentManager.getAddress()
    };

    const deploymentPath = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentPath)) {
      fs.mkdirSync(deploymentPath);
    }

    fs.writeFileSync(
      path.join(deploymentPath, "deployment.json"),
      JSON.stringify(deploymentAddresses, null, 2)
    );

    console.log("\nDeployment addresses saved to deployment.json");
    console.log("\nDeployment completed successfully!");

  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });