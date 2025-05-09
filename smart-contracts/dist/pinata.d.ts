export declare class PinataWrapper {
    private pinata;
    private static instance;
    constructor();
    static getInstance(): PinataWrapper;
    testAuthentication(): Promise<boolean>;
    pinFileToIPFS(filePath: string, options?: any): Promise<{
        IpfsHash: string;
        PinSize: number;
        Timestamp: string;
    }>;
    pinJSONToIPFS(jsonBody: object, options?: any): Promise<{
        IpfsHash: string;
        PinSize: number;
        Timestamp: string;
    }>;
    getIPFSGatewayURL(hash: string): string;
}
