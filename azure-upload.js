const { BlobServiceClient, BlobSASPermissions } = require("@azure/storage-blob");
const fs = require("fs");
const path = require("path");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.argv[2];
const filePath = process.argv[3];
const fileName = path.basename(filePath);

async function main() {
    if (!connectionString) {
        console.error("Missing AZURE_STORAGE_CONNECTION_STRING environment variable.");
        process.exit(1);
    }

    if (!containerName || !filePath) {
        console.error("Usage: node azure-upload.js <container-name> <file-path>");
        process.exit(1);
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create the container if it doesn't exist
    try {
        console.log(`Creating container: ${containerName}...`);
        await containerClient.createIfNotExists();
        console.log("Container ready.");
    } catch (err) {
        console.error("Failed to create container:", err.message);
        process.exit(1);
    }

    // Upload the file to the container
    try {
        console.log(`Uploading ${fileName}...`);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const fileContent = fs.readFileSync(filePath);
        await blockBlobClient.upload(fileContent, fileContent.length);
        console.log("File uploaded successfully.");
    } catch (err) {
        console.error("Failed to upload file:", err.message);
        process.exit(1);
    }

    // List blobs in the container
    try {
        console.log(`\nFiles in container "${containerName}":`);
        for await (const blob of containerClient.listBlobsFlat()) {
            console.log(" -", blob.name, `(${blob.properties.contentLength} bytes)`);
        }
    } catch (err) {
        console.error("Failed to list blobs:", err.message);
    }

    // Generate a pre-signed URL for the uploaded file
    try {
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const expiresOn = new Date(Date.now() + 5 * 60 * 1000);
        const sasUrl = await blockBlobClient.generateSasUrl({
            permissions: BlobSASPermissions.parse("r"),
            expiresOn: expiresOn,
        });
        console.log("\nPre-signed URL (valid for 5 minutes):");
        console.log(sasUrl);
    } catch (err) {
        console.error("Failed to generate pre-signed URL:", err.message);
    }
}

main();