import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import multer from 'multer';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import sharp from 'sharp';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Compress if image > 2MB
const compressImageIfNeeded = async (fileBuffer, mimeType) => {
  if (fileBuffer.length > 2 * 1024 * 1024 && mimeType.startsWith('image')) {
    return await sharp(fileBuffer).resize({ width: 2000 }).toBuffer();
  }
  return fileBuffer;
};

// Get total user size from S3
const getUserTotalSize = async (prefix) => {
  let totalSize = 0;
  let continuationToken = undefined;

  do {
    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    if (response.Contents) {
      totalSize += response.Contents.reduce((sum, obj) => sum + obj.Size, 0);
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return totalSize;
};

// Upload with size check
const uploadImageToS3 = async (fileBuffer, fileName, mimeType,folderName,userId) => {
  const compressedBuffer = await compressImageIfNeeded(fileBuffer, mimeType);
  const fileSize = compressedBuffer.length;

  const prefix = `uploads/${userId}/${folderName}/`;
  const totalSize = await getUserTotalSize(`uploads/${userId}/`);

  const oneGB = 1 * 1024 * 1024 * 1024;
  if (totalSize + fileSize > oneGB) {
    throw new Error("1GB storage limit exceeded. Please delete old files.");
  }

  const key = `${prefix}${Date.now()}-${randomUUID()}-${fileName}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: compressedBuffer,
    ContentType: mimeType,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
// Upload with size check
const uploadFileToS3 = async (fileBuffer, fileName, mimeType, userId) => {
  const compressedBuffer = await compressImageIfNeeded(fileBuffer, mimeType);
  const fileSize = compressedBuffer.length;

  const prefix = `uploads/${userId}/`;
  const totalSize = await getUserTotalSize(prefix);

  const oneGB = 1 * 1024 * 1024 * 1024;
  if (totalSize + fileSize > oneGB) {
    throw new Error("1GB storage limit exceeded. Please delete old files.");
  }

  const key = `${prefix}${Date.now()}-${randomUUID()}-${fileName}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: compressedBuffer,
    ContentType: mimeType,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};


const deleteFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });
  await s3.send(command);
};

export { upload, uploadImageToS3,uploadFileToS3,deleteFromS3 };
