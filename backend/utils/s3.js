const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const S3_BUCKET = process.env.S3_BUCKET;

async function uploadFile(buffer, key, contentType) {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };
  return s3.upload(params).promise();
}

function getSignedUrl(key, expires = 60 * 5) {
  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires: expires, // URL expires in 5 mins
  };
  return s3.getSignedUrl('getObject', params);
}

module.exports = { uploadFile, getSignedUrl };
