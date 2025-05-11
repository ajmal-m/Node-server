const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const crypto = require("crypto");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");

const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");


dotenv.config();

const bucket_name = process.env.BUCKET_NAME;
const bucket_region = process.env.BUCKET_REGION;
const aws_uer_access_key = process.env.AWS_UER_ACCESS_KEY;
const aws_user_secret_key =  process.env.AWS_USER_SECRET_KEY;

const s3 = new S3Client({
    region: bucket_region,
    credentials:{
        accessKeyId: aws_uer_access_key,
        secretAccessKey: aws_user_secret_key
    }
});


router.post('/asset-upload', upload.single("image"), async (req, res) => {
    console.log(req.file)

    const randomImageName = crypto.randomBytes(16).toString('hex');
    const params = {
        Bucket: bucket_name,
        Key: randomImageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    console.log(params)
    const command = new PutObjectCommand(params);

    await s3.send(command);


    // GET OBJECT 
    const getObjectParams = {
        Bucket: bucket_name,
        Key: randomImageName
    }
    const getCommand = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });


    res.status(200).json({
        success:true,
        message:"Asset Uploading added",
        url
    })
});



module.exports = router;