# S3 File Uploader

A Node.js script that uploads a local file to an AWS S3 bucket, lists the bucket contents, and generates a temporary pre-signed URL for the uploaded file.

## Prerequisites

- Node.js installed
- An AWS account with an IAM user that has `AmazonS3FullAccess` permissions
- AWS access key ID and secret access key for that IAM user

## Setup

1. Clone the repository and install dependencies:

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

## Usage

```
node upload.js <bucket-name> <file-path>
```

Example:
```
node upload.js my-bucket sample.txt
```

## What it does

1. Creates the S3 bucket if it does not already exist
2. Uploads the specified file to the bucket
3. Lists all files currently in the bucket
4. Generates a pre-signed URL valid for 5 minutes to access the uploaded file

## Security Notes

- Never hardcode AWS credentials in your code
- Keep your bucket private (the default). Use pre-signed URLs to share files
