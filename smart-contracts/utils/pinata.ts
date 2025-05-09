import PinataClient from '@pinata/sdk';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

export class PinataWrapper {
    private pinata;
    private static instance: PinataWrapper;

    constructor() {
        const apiKey = process.env.PINATA_API_KEY || process.env.NEXT_PUBLIC_PINATA_API_KEY;
        const apiSecret = process.env.PINATA_API_SECRET || process.env.NEXT_PUBLIC_PINATA_API_SECRET;
        
        if (!apiKey || !apiSecret) {
            throw new Error('Pinata API credentials not found in environment variables');
        }

        this.pinata = new PinataClient(apiKey, apiSecret);
    }    static getInstance(): PinataWrapper {
        if (!PinataWrapper.instance) {
            PinataWrapper.instance = new PinataWrapper();
        }
        return PinataWrapper.instance;
    }

    async testAuthentication() {
        try {
            await this.pinata.testAuthentication();
            return true;
        } catch (error) {
            console.error('Authentication Error:', error);
            return false;
        }
    }    async pinFileToIPFS(filePath: string, options: any = {}): Promise<{ IpfsHash: string; PinSize: number; Timestamp: string }> {
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
        } catch (error) {
            console.error('Error uploading to IPFS:', error);
            throw error;
        }
    }

    async pinJSONToIPFS(jsonBody: object, options: any = {}): Promise<{ IpfsHash: string; PinSize: number; Timestamp: string }> {
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
        } catch (error) {
            console.error('Error uploading JSON to IPFS:', error);
            throw error;
        }
    }

    getIPFSGatewayURL(hash: string): string {
        const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs';
        return `${gateway}/${hash}`;
    }
}
