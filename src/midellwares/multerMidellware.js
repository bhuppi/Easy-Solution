const { Credentials } = require("aws-sdk");
const S3 = require("aws-sdk/clients/s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const createError = require("http-errors");

const s3Client = new S3({
  region: process.env.LINODE_OBJECT_STORAGE_REGION || "ap-south-1",
  endpoint:
    process.env.LINODE_OBJECT_STORAGE_ENDPOINT ||
    "ap-south-1.linodeobjects.com",
  sslEnabled: true,
  s3ForcePathStyle: false,
  credentials: new Credentials({
    accessKeyId:
      process.env.LINODE_OBJECT_STORAGE_ACCESS_KEY_ID || "NXBFVTX007YYQB6RN2TU",
    secretAccessKey: "5afy6ISNQqhwYTq6cWuCg8sGMtnOSqoifBh4gAgf",
  }),
});

function multerFilter(file, cb) {
  if (file.mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPEG format allowed!"), false); // Reject the file with an error
  }
}

exports.upload = multer({
  storage: multerS3({
    s3: s3Client,
    acl: "public-read",
    bucket: "satyakabirbucket",
    contentType: function (req, files, cb) {
      cb(null, files.mimetype);
    },
    metadata: function (req, file, cb) {
      multerFilter(file,cb);
      cb(null, { fieldName: file.fieldname });

    },
    key: function (req, file, cb) {
      cb(
        null,
        process.env.BUCKET_FOLDER_PATH
           + Date.now().toString() + file.originalname
      );
    },
  }),
});

exports.deleteFileFromObjectStorage = (path) => {
  // const Key = url.split(`${process.env.LINODE_OBJECT_STORAGE_ENDPOINT}/`)[1];
  const Key = path;

  const params = {
    Bucket: process.env.LINODE_OBJECT_BUCKET, 
    Key,
  };

  // // see: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
  // // eslint-disable-next-line consistent-return
  console.log(s3Client.deleteObject(params).promise());
};
