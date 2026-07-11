const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3Config');

const deleteFromS3 = async (key) => {
  if (!key) return;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    console.log(`Successfully deleted ${key} from S3`);
  } catch (error) {
    console.error(`Error deleting ${key} from S3:`, error);
    throw new Error('Failed to delete file from S3');
  }
};

module.exports = deleteFromS3;
