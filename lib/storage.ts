import { S3 } from 'aws-sdk';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string
) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `reviews/${Date.now()}-${fileName}`,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read',
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

export async function deleteFile(fileUrl: string) {
  const key = fileUrl.split('/').pop();
  if (!key) return;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `reviews/${key}`,
  };

  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
} 