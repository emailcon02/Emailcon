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

const compressImageIfNeeded = async (fileBuffer, mimeType) => {
  const maxSize = 250 * 1024; // 250KB
  const targetSize = 200 * 1024; // 200KB

  if (fileBuffer.length > maxSize && mimeType.startsWith('image')) {
    let quality = 80;
    let resizedBuffer;

    // Try compressing repeatedly until below 200KB or quality becomes too low
    do {
      resizedBuffer = await sharp(fileBuffer)
        .resize({ width: 2000 }) // Optional: Adjust width for additional control
        .jpeg({ quality })
        .toBuffer();

      quality -= 10;
    } while (resizedBuffer.length > targetSize && quality >= 40); // Stop if too low quality

    return resizedBuffer;
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

const MAX_USER_STORAGE = 100 * 1024 * 1024; // 100MB

const uploadImageToS3 = async (fileBuffer, fileName, mimeType, folderName, userId) => {
  const compressedBuffer = await compressImageIfNeeded(fileBuffer, mimeType);
  const fileSize = compressedBuffer.length;

  const prefix = `uploads/${userId}/${folderName}/`;
  const totalSize = await getUserTotalSize(`uploads/${userId}/`);

  if (totalSize + fileSize > MAX_USER_STORAGE) {
    throw new Error("Your storage limit exceeded. Please delete old files.");
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

const uploadFileToS3 = async (fileBuffer, fileName, mimeType, userId,folderName) => {
  const compressedBuffer = await compressImageIfNeeded(fileBuffer, mimeType);
  const fileSize = compressedBuffer.length;

  const prefix = `uploads/${userId}/${folderName}/`;
  const totalSize = await getUserTotalSize(prefix);

  if (totalSize + fileSize > MAX_USER_STORAGE) {
    throw new Error("Your storage limit exceeded. Please delete old files.");
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
