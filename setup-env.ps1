# Setup script for BrickEarn environment variables
$ErrorActionPreference = "Stop"

function Write-Header {
    param($Message)
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

function Get-UserInput {
    param($Prompt, $Default = "")
    $input = Read-Host "$Prompt [${Default}]"
    if ([string]::IsNullOrWhiteSpace($input)) { return $Default }
    return $input
}

Write-Header "BrickEarn Environment Setup"

# Check if Alchemy account exists
Write-Host "`nFirst, you'll need an Alchemy account for RPC endpoints."
Write-Host "Visit https://alchemy.com to create one if you haven't already."
$hasAlchemy = Read-Host "Do you have an Alchemy account? (y/n)"

if ($hasAlchemy -ne "y") {
    Write-Host "`nPlease create an Alchemy account first and then run this script again."
    Write-Host "1. Go to https://alchemy.com"
    Write-Host "2. Create an account and create a new app"
    Write-Host "3. Get your API key"
    exit
}

# Smart Contracts Environment
Write-Header "Smart Contracts Environment Setup"

$smartContractsEnv = @{
    SEPOLIA_URL = Get-UserInput "Enter your Alchemy Sepolia RPC URL"
    PRIVATE_KEY = Get-UserInput "Enter your wallet private key (without 0x prefix)"
    ETHERSCAN_API_KEY = Get-UserInput "Enter your Etherscan API key"
}

$smartContractsEnvContent = @"
# Network RPC URLs
SEPOLIA_URL=$($smartContractsEnv.SEPOLIA_URL)
MAINNET_URL=

# Wallet Private Key (without 0x prefix)
PRIVATE_KEY=$($smartContractsEnv.PRIVATE_KEY)

# API Keys
ETHERSCAN_API_KEY=$($smartContractsEnv.ETHERSCAN_API_KEY)

# Gas Reporter
REPORT_GAS=false

# Contract Configuration
PLATFORM_FEE_BPS=250  # 2.50%
BCT_DISCOUNT_RATE=2000  # 20.00%
MIN_TOKENS=100
MAX_TOKENS=1000000
MAX_TRADING_DELAY=31536000  # 365 days in seconds

# Local Development
LOCAL_RPC_URL=http://127.0.0.1:8545
"@

# Frontend Environment
Write-Header "Frontend Environment Setup"

$ipfsProjectId = Get-UserInput "Enter your IPFS Project ID (from Infura)"
$ipfsProjectSecret = Get-UserInput "Enter your IPFS Project Secret (from Infura)"
$walletConnectProjectId = Get-UserInput "Enter your WalletConnect Project ID"

# Extract Alchemy API Key from RPC URL
$alchemyApiKey = ""
if ($smartContractsEnv.SEPOLIA_URL -match "v2/([a-zA-Z0-9_-]+)$") {
    $alchemyApiKey = $matches[1]
}

$frontendEnvContent = @"
# Environment variables for the BrickEarn frontend
NEXT_PUBLIC_ENVIRONMENT=development

# Blockchain Configuration
NEXT_PUBLIC_DEFAULT_CHAIN=sepolia
NEXT_PUBLIC_RPC_URL=$($smartContractsEnv.SEPOLIA_URL)
NEXT_PUBLIC_WSS_RPC_URL=$(($smartContractsEnv.SEPOLIA_URL -replace "https://", "wss://"))

# IPFS Configuration (using Infura)
NEXT_PUBLIC_IPFS_PROJECT_ID=$ipfsProjectId
NEXT_PUBLIC_IPFS_PROJECT_SECRET=$ipfsProjectSecret
NEXT_PUBLIC_IPFS_DEDICATED_GATEWAY=https://brickearn.infura-ipfs.io

# API Keys
NEXT_PUBLIC_ALCHEMY_API_KEY=$alchemyApiKey
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=$walletConnectProjectId

# Features Flags
NEXT_PUBLIC_ENABLE_TESTNET_FAUCET=true
NEXT_PUBLIC_ENABLE_BCT_REWARDS=true
"@

# Save the files
Write-Header "Saving Environment Files"

try {
    # Save smart contracts .env
    $smartContractsEnvContent | Out-File -FilePath "smart-contracts\.env" -Encoding UTF8 -Force
    Write-Host "✓ Saved smart-contracts/.env" -ForegroundColor Green

    # Save frontend .env
    $frontendEnvContent | Out-File -FilePath ".env" -Encoding UTF8 -Force
    Write-Host "✓ Saved .env" -ForegroundColor Green

    # Create example files
    $smartContractsEnvContent | Out-File -FilePath "smart-contracts\.env.example" -Encoding UTF8 -Force
    $frontendEnvContent | Out-File -FilePath ".env.example" -Encoding UTF8 -Force
    Write-Host "✓ Created example files" -ForegroundColor Green

    Write-Host "`nEnvironment setup completed successfully!" -ForegroundColor Green
    
    Write-Header "Next Steps"
    Write-Host "1. Install dependencies:"
    Write-Host "   cd brickearn"
    Write-Host "   npm install"
    Write-Host "   cd smart-contracts"
    Write-Host "   npm install"
    Write-Host "`n2. Compile contracts:"
    Write-Host "   npx hardhat compile"
    Write-Host "`n3. Run local node:"
    Write-Host "   npx hardhat node"
    Write-Host "`n4. Deploy contracts (in a new terminal):"
    Write-Host "   npx hardhat run scripts/deploy.ts --network localhost"

} catch {
    Write-Host "`nError: Failed to save environment files" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}
