import axios from 'axios';
import FormData from 'form-data';

const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

interface PinataConfig {
  apiKey: string;
  apiSecret: string;
  jwt: string;
}

class PinataClient {
  private config: PinataConfig;

  constructor(config: PinataConfig) {
    this.config = config;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.config.jwt}`,
    };
  }

  async uploadFile(file: File, metadata: any = {}): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add metadata
      const options = {
        pinataMetadata: {
          name: file.name,
          keyvalues: metadata
        }
      };
      formData.append('pinataOptions', JSON.stringify(options));

      const response = await axios.post(
        `${PINATA_API_URL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...this.headers,
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`
          }
        }
      );

      return `${PINATA_GATEWAY}/${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  async uploadJSON(data: any): Promise<string> {
    try {
      const response = await axios.post(
        `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
        data,
        {
          headers: this.headers
        }
      );

      return `${PINATA_GATEWAY}/${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading JSON to Pinata:', error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  }

  async uploadBatch(files: File[], metadata: any = {}): Promise<string[]> {
    return Promise.all(files.map(file => this.uploadFile(file, metadata)));
  }

  async uploadPropertyFiles(
    propertyFiles: {
      images: { primary: File[], gallery: File[] },
      documents: { titleDeed: File[], additionalDocs: File[] }
    },
    propertyId: string
  ): Promise<{
    images: { primary: string[], gallery: string[] },
    documents: { titleDeed: string[], additionalDocs: string[] }
  }> {
    try {
      // Upload all files in parallel with appropriate metadata
      const [primaryImages, galleryImages, titleDeeds, additionalDocs] = await Promise.all([
        this.uploadBatch(propertyFiles.images.primary, { type: 'primary', propertyId }),
        this.uploadBatch(propertyFiles.images.gallery, { type: 'gallery', propertyId }),
        this.uploadBatch(propertyFiles.documents.titleDeed, { type: 'titleDeed', propertyId }),
        this.uploadBatch(propertyFiles.documents.additionalDocs, { type: 'additionalDoc', propertyId })
      ]);

      return {
        images: {
          primary: primaryImages,
          gallery: galleryImages
        },
        documents: {
          titleDeed: titleDeeds,
          additionalDocs: additionalDocs
        }
      };
    } catch (error) {
      console.error('Error uploading property files:', error);
      throw new Error('Failed to upload property files');
    }
  }
}

// Create singleton instance
const pinata = new PinataClient({
  apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
  apiSecret: process.env.NEXT_PUBLIC_PINATA_API_SECRET!,
  jwt: process.env.NEXT_PUBLIC_PINATA_JWT!
});

export default pinata;
