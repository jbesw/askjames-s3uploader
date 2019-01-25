// This is the function you will need in your Lambda to make the backend work.
// Follow along in the tutorial to see how to set this up.

const uuidv4 = require('uuid/v4')
const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION || 'us-east-1' })
const s3 = new AWS.S3();

const uploadBucket = '<< ENTER YOUR BUCKET NAME HERE >>'   // << LOOK!

exports.handler = async (event) => {
  const result = await getUploadURL()
  console.log('Result: ', result)
  return result
};

const getUploadURL = async function() {
  console.log('getUploadURL started')
  let actionId = uuidv4()

  var s3Params = {
    Bucket: uploadBucket,
    Key:  `${actionId}.jpg`,
    ContentType: 'image/jpeg',
    CacheControl: 'max-age=31104000',
    ACL: 'public-read',
  };

  return new Promise((resolve, reject) => {
    // Get signed URL
    let uploadURL = s3.getSignedUrl('putObject', s3Params)
    resolve({
      "statusCode": 200,
      "isBase64Encoded": false,
      "headers": {
        "Access-Control-Allow-Origin": "*"
      },
      "body": JSON.stringify({
          "uploadURL": uploadURL,
          "photoFilename": `${actionId}.jpg`
      })
    })
  })
}