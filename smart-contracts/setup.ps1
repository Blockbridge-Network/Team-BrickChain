# PowerShell script to set up the smart contracts environment
$ErrorActionPreference = "Stop"

function Write-Step {
    param($Message)
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

Write-Step "Setting up BrickEarn smart contracts environment"

# Define directory structure
$directories = @(
    "..\src\contracts\abis",
    "..\src\contracts\types",
    "..\src\contracts\hooks",
    "..\src\contracts\utils",
    "..\src\contracts\constants",
    "artifacts",
    "typechain-types"
)

# Create directories
Write-Step "Creating directory structure"
foreach ($dir in $directories) {
    $path = Join-Path $PSScriptRoot $dir
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force
        Write-Host "Created directory: $dir" -ForegroundColor Green
    }
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Step "Installing dependencies"
    npm install
}

# Copy environment file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Step "Creating .env file from template"
    Copy-Item ".env.example" ".env" -ErrorAction SilentlyContinue
    Write-Host "Created .env file. Please update it with your configuration." -ForegroundColor Yellow
}

# Create contract type definition files
Write-Step "Creating contract type definitions"

$contractTypes = @"
// Auto-generated type definitions for BrickEarn contracts
export type PropertyType = 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LAND';
export type PropertyStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'SOLD_OUT' | 'DELISTED';
export type OwnershipType = 'FULL' | 'FRACTIONAL';

export interface PropertyMetadata {
    propertyAddress: string;
    description: string;
    amenities: string[];
    yearBuilt: number;
    totalArea: number;
}

export interface TokenizationConfig {
    ownershipType: OwnershipType;
    totalTokens: number;
    pricePerToken: number;
    minimumInvestment: number;
    tradingDelay: number;
    platformFee: number;
    bctDiscountRate: number;
}

export interface PropertyDocuments {
    primaryImageURI: string;
    galleryImageURIs: string[];
    titleDeedURI: string;
    additionalDocURIs: string[];
    certificateURIs: string[];
}

export interface Property {
    owner: string;
    title: string;
    propertyType: PropertyType;
    location: string;
    city: string;
    state: string;
    country: string;
    size: number;
    yearBuilt: number;
    isVerified: boolean;
    isLocked: boolean;
    status: PropertyStatus;
    price: number;
    metadata: PropertyMetadata;
    documents: PropertyDocuments;
}
"@

$contractTypes | Out-File -FilePath "..\src\contracts\types\contracts.ts" -Encoding UTF8

# Create contract initialization utilities
Write-Step "Creating contract utilities"

$contractUtils = @"
import { ethers } from 'ethers';
import {
    PropertyRegistry__factory,
    FractionalOwnership__factory,
    AssetMarketplace__factory,
    InvestmentManager__factory,
    BCTToken__factory
} from '../types/factories';
import { getDeployedAddresses } from '../constants';

export async function initializeContracts(
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    signer?: ethers.Signer
) {
    const addresses = await getDeployedAddresses();
    const contractSigner = signer || provider.getSigner();

    return {
        propertyRegistry: PropertyRegistry__factory.connect(
            addresses.PropertyRegistry,
            contractSigner
        ),
        fractionalOwnership: FractionalOwnership__factory.connect(
            addresses.FractionalOwnership,
            contractSigner
        ),
        marketplace: AssetMarketplace__factory.connect(
            addresses.AssetMarketplace,
            contractSigner
        ),
        investmentManager: InvestmentManager__factory.connect(
            addresses.InvestmentManager,
            contractSigner
        ),
        bctToken: BCTToken__factory.connect(
            addresses.BCTToken,
            contractSigner
        )
    };
}
"@

$contractUtils | Out-File -FilePath "..\src\contracts\utils\contracts.ts" -Encoding UTF8

# Create constants file for contract addresses
Write-Step "Creating contract constants"

$contractConstants = @"
import deploymentInfo from '../../../smart-contracts/deployment.json';

export interface DeployedAddresses {
    BCTToken: string;
    PropertyRegistry: string;
    FractionalOwnership: string;
    AssetMarketplace: string;
    InvestmentManager: string;
    network: string;
}

export async function getDeployedAddresses(): Promise<DeployedAddresses> {
    // In production, you might want to fetch this from an API or environment variables
    return deploymentInfo as DeployedAddresses;
}

export const SUPPORTED_NETWORKS = ['localhost', 'sepolia', 'mainnet'];
"@

$contractConstants | Out-File -FilePath "..\src\contracts\constants\addresses.ts" -Encoding UTF8

# Compile contracts
Write-Step "Compiling contracts"
npm run compile

Write-Host "`nSetup completed successfully!" -ForegroundColor Green
Write-Host @"

Next steps:
1. Update .env file with your configuration
2. Review generated type definitions in src/contracts/types
3. Run 'npm test' to verify the setup
4. Deploy contracts using 'npm run deploy:local'

"@ -ForegroundColor Yellow