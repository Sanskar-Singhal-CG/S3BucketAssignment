const { S3Client, CreateBucketCommand, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const bucketName = process.argv[2];
const filePath = process.argv[3];
const fileName = path.basename(filePath);

async function main() {
    if (!bucketName || !filePath) {
        console.error("Usage: node upload.js <bucket-name> <file-path>");
        process.exit(1);
    }

    // Create the bucket if it doesn't exist
    try {
        console.log(`Creating bucket: ${bucketName}...`);
        await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log("Bucket created successfully.");

    } catch (err) {
        if (err.name === "BucketAlreadyOwnedByYou") {
            console.log("Bucket already exists, continuing...");
        } else {
            console.error("Failed to create bucket:", err.message);
            process.exit(1);
        }
    }

    // Upload the file to the bucket
    try {
        console.log(`Uploading ${fileName}...`);
        const fileContent = fs.readFileSync(filePath);
        await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileContent,
        }));
        console.log("File uploaded successfully.");
    } catch (err) {
        console.error("Failed to upload file:", err.message);
        process.exit(1);
    }

    // List objects in the bucket
    try {
        console.log(`\nFiles in bucket "${bucketName}":`);
        const response = await s3.send(new ListObjectsV2Command({ Bucket: bucketName }));
        response.Contents.forEach(obj => {
            console.log(" -", obj.Key, `(${obj.Size} bytes)`);
        });
    } catch (err) {
        console.error("Failed to list objects:", err.message);
    }

    // Generate a signed URL for the uploaded file
    try {
        const command = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
        const url = await getSignedUrl(s3, command, { expiresIn: 300 });
        console.log("\nPre-signed URL (valid for 1 hour):");
        console.log(url);
    } catch (err) {
        console.error("Failed to generate pre-signed URL:", err.message);
    }
}

main();