import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import settings from "../config/settings";
import { randomBytes } from 'crypto';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, } from '@aws-sdk/client-s3';
 
 

export class S3Service {
    private s3: S3Client;
 
    constructor() {
        this.s3 = new S3Client({
            credentials: {
              accessKeyId: settings.AWS_ACCESS_KEY_ID,
              secretAccessKey: settings.AWS_SECRET_ACCESS_KEY,
            },
            region: settings.AWS_BUCKET_REGION,
        });
    }
 
    private randomFileName = (bytes: number = 16): string => randomBytes(bytes).toString('hex');

    public async uploadFile(data: string, folder: string): Promise<string> {
        const matches = data.match(/^data:([A-Za-z0-9-+\/]+);base64,(.+)$/);
        if (!matches) {
            throw new Error('Invalid base64 data format');
        }
        const type = matches[1];
        const buffer = new Buffer(matches[2], 'base64');
        let key = '';
        if (settings.AWS_BUCKET_KEY) {
            key = settings.AWS_BUCKET_KEY + '/' + folder + '/' + this.randomFileName();
        } else {
            key = this.randomFileName();
        }
        const params = {
            Bucket: settings.AWS_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: type,
        };
        try {
            const command = new PutObjectCommand(params);
            await this.s3.send(command);
            return key;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Error uploading file to S3: ${errorMessage}`);
        }
    }
 
 
    public getUrl(key: string): string {
        return `https://${settings.AWS_BUCKET_NAME}.s3.${settings.AWS_BUCKET_REGION}.amazonaws.com/${key}`;
    }
    public async getFileUrl(key: string) {
        const getObjectParams = {
            Bucket: settings.AWS_BUCKET_NAME,
            Key: key,
        };
        try {
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(this.s3, command, { expiresIn: 60 * 10 });
            return url;
        } catch (error) {
            return false;
        }
    }
 

    public async removeFile (key: string) {
        const getObjectParams = {
          Bucket: settings.AWS_BUCKET_NAME,
          Key: key,
        };
        try {
          console.log(key);
          const command = new DeleteObjectCommand(getObjectParams);
          await this.s3.send(command);
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
    };
 
    public async removeFiles(keys: string[]) {
        const getObjectParams = {
            Bucket: settings.AWS_BUCKET_NAME,
            Delete: {
              Objects: keys.map((Key) => ({ Key })),
              Quiet: false,
            },
        };
        try {
            console.log(keys.map((Key) => ({ Key })));
            const command = new DeleteObjectsCommand(getObjectParams);
            await this.s3.send(command);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
} 