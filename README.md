# Cloud File Uploader

Two Node.js scripts that upload a local file to cloud storage that is one for AWS S3 and one for Azure Blob Storage. Both list the container contents and generate a temporary pre-signed URL for the uploaded file.

---

## AWS S3 (`aws-upload.js`)

### Prerequisites

- An AWS account with an IAM user that has `AmazonS3FullAccess` permissions
- AWS access key ID and secret access key for that IAM user

### Setup

1. Install dependencies:

```
npm install
```

2. Set your AWS credentials as environment variables:

On Windows (PowerShell):
```
$env:AWS_ACCESS_KEY_ID="your-access-key"
$env:AWS_SECRET_ACCESS_KEY="your-secret-key"
```

On Mac/Linux:
```
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
```

### Usage

```
node aws-upload.js <bucket-name> <file-path>
```

Example:
```
node aws-upload.js my-bucket sample.txt
```

### What it does

1. Creates the S3 bucket if it does not already exist
2. Uploads the specified file to the bucket
3. Lists all files currently in the bucket
4. Generates a pre-signed URL valid for 1 hour to access the uploaded file

---

## Azure Blob Storage (`azure-upload.js`)

### Prerequisites

- An Azure account with a Storage Account created
- Connection string from the Storage Account's Access Keys page

### Setup

Set your Azure connection string as an environment variable:

On Windows (PowerShell):
```
$env:AZURE_STORAGE_CONNECTION_STRING="your-connection-string"
```

On Mac/Linux:
```
export AZURE_STORAGE_CONNECTION_STRING="your-connection-string"
```

### Usage

```
node azure-upload.js <container-name> <file-path>
```

Example:
```
node azure-upload.js my-container sample.txt
```

Container names must be lowercase and may only contain letters, numbers, and hyphens.

### What it does

1. Creates the container if it does not already exist
2. Uploads the specified file to the container
3. Lists all files currently in the container
4. Generates a SAS URL valid for 5 minutes to access the uploaded file

---

## Security Notes

- Never hardcode credentials in your code
- Keep your storage private (the default). Use pre-signed/SAS URLs to share files
