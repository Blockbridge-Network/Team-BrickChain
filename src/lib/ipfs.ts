const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';
const IPFS_PREFIX = 'ipfs://';
const IPFS_IO_PREFIX = 'https://ipfs.io/ipfs/';

export function resolveIpfsUrl(url: string): string {
  if (!url) return '/placeholder-property.jpg';

  // Handle ipfs:// protocol
  if (url.startsWith(IPFS_PREFIX)) {
    const hash = url.slice(IPFS_PREFIX.length);
    return `${IPFS_GATEWAY}${hash}`;
  }

  // Handle https://ipfs.io/ipfs/ URLs
  if (url.startsWith(IPFS_IO_PREFIX)) {
    const hash = url.slice(IPFS_IO_PREFIX.length);
    return `${IPFS_GATEWAY}${hash}`;
  }

  // If it's already a gateway URL or regular URL, return as is
  if (url.startsWith('http')) {
    return url;
  }

  // If it's just a hash, add the gateway
  if (url.match(/^[a-zA-Z0-9]{46,59}$/)) {
    return `${IPFS_GATEWAY}${url}`;
  }

  // Return placeholder for invalid URLs
  return '/placeholder-property.jpg';
}

export function ipfsHashFromUrl(url: string): string | null {
  if (!url) return null;

  if (url.startsWith(IPFS_PREFIX)) {
    return url.slice(IPFS_PREFIX.length);
  }

  if (url.startsWith(IPFS_IO_PREFIX)) {
    return url.slice(IPFS_IO_PREFIX.length);
  }

  if (url.includes('/ipfs/')) {
    const match = url.match(/\/ipfs\/([a-zA-Z0-9]{46,59})/);
    return match ? match[1] : null;
  }

  return null;
}

export class IPFSService {
  private pinataApiKey: string;
  private pinataSecretKey: string;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      throw new Error('Pinata API credentials not found');
    }

    this.pinataApiKey = apiKey;
    this.pinataSecretKey = apiSecret;
  }

  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS');
      }

      const result = await response.json();
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }

  async uploadFiles(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  getUrl(hash: string): string {
    if (!hash) return '/placeholder-property.jpg';
    return resolveIpfsUrl(hash);
  }
}

export const ipfs = new IPFSService();
