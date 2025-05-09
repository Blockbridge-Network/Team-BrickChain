"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinataWrapper = void 0;
const sdk_1 = __importDefault(require("@pinata/sdk"));
const fs = __importStar(require("fs"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class PinataWrapper {
    constructor() {
        const apiKey = process.env.PINATA_API_KEY || process.env.NEXT_PUBLIC_PINATA_API_KEY;
        const apiSecret = process.env.PINATA_API_SECRET || process.env.NEXT_PUBLIC_PINATA_API_SECRET;
        if (!apiKey || !apiSecret) {
            throw new Error('Pinata API credentials not found in environment variables');
        }
        this.pinata = new sdk_1.default(apiKey, apiSecret);
    }
    static getInstance() {
        if (!PinataWrapper.instance) {
            PinataWrapper.instance = new PinataWrapper();
        }
        return PinataWrapper.instance;
    }
    async testAuthentication() {
        try {
            await this.pinata.testAuthentication();
            return true;
        }
        catch (error) {
            console.error('Authentication Error:', error);
            return false;
        }
    }
    async pinFileToIPFS(filePath, options = {}) {
        try {
            const readableStreamForFile = fs.createReadStream(filePath);
            const metadata = {
                name: `BrickEarn-${Date.now()}`,
                keyvalues: {
                    ...options.metadata
                }
            };
            const result = await this.pinata.pinFileToIPFS(readableStreamForFile, {
                pinataMetadata: metadata
            });
            return result;
        }
        catch (error) {
            console.error('Error uploading to IPFS:', error);
            throw error;
        }
    }
    async pinJSONToIPFS(jsonBody, options = {}) {
        try {
            const metadata = {
                name: `BrickEarn-${Date.now()}`,
                keyvalues: {
                    ...options.metadata
                }
            };
            const result = await this.pinata.pinJSONToIPFS(jsonBody, {
                pinataMetadata: metadata
            });
            return result;
        }
        catch (error) {
            console.error('Error uploading JSON to IPFS:', error);
            throw error;
        }
    }
    getIPFSGatewayURL(hash) {
        const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs';
        return `${gateway}/${hash}`;
    }
}
exports.PinataWrapper = PinataWrapper;
