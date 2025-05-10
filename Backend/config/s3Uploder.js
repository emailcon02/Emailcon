import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
import sharp from 'sharp'; // for image compression

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage(); // multer stores files in memory
const upload = multer({ storage });

// Compress image if file size > 2MB
const compressImageIfNeeded = async (fileBuffer, mimeType) => {
  if (fileBuffer.length > 2 * 1024 * 1024) { // Check if file size > 2MB
    if (mimeType.startsWith('image')) {
      const compressedBuffer = await sharp(fileBuffer)
        .resize({ width: 2000 }) // Resize image to a width of 1000px, adjust as necessary
        .toBuffer();
      return compressedBuffer;
    }
  }
  return fileBuffer; // Return original buffer if no compression is needed
};

// Upload to S3
const uploadToS3 = async (fileBuffer, fileName, mimeType) => {
  // Compress the file if needed
  const compressedBuffer = await compressImageIfNeeded(fileBuffer, mimeType);

  const key = `${Date.now()}-${randomUUID()}-${fileName}`;
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

// Delete from S3
const deleteFromS3 = async (key) => {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };

  const command = new DeleteObjectCommand(deleteParams);
  await s3.send(command);
};

export { upload, uploadToS3, deleteFromS3 };
