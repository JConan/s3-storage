# Storage Service API Documentation

## Bucket Operations

### Create Bucket
Create a new bucket
```
PUT /:bucketName
```

Example response:
```json
{
  "name": "my-bucket",
  "createdAt": "2025-01-27T14:30:30.000Z",
  "updatedAt": "2025-01-27T14:30:30.000Z"
}
```

### List Buckets
List all available buckets
```
GET /
```

Example response:
```json
{
  "Buckets": [
    {
      "name": "my-bucket",
      "createdAt": "2025-01-27T14:30:30.000Z",
      "updatedAt": "2025-01-27T14:30:30.000Z"
    }
  ]
}
```

### Delete Bucket
Delete a bucket and its contents
```
DELETE /:bucketName
```

Response: 204 No Content

### Get Bucket Info
Get information about a specific bucket
```
GET /:bucketName
```

Example response:
```json
{
  "name": "my-bucket",
  "createdAt": "2025-01-27T14:30:30.000Z",
  "updatedAt": "2025-01-27T14:30:30.000Z"
}
```

## File Operations

### Upload File
Upload a file to a bucket
```
PUT /:bucketName/files/:fileName
```

Example response:
```json
{
  "name": "example.jpg",
  "bucket": "my-bucket",
  "size": 123456,
  "contentType": "image/jpeg",
  "createdAt": "2025-01-27T14:30:30.000Z",
  "updatedAt": "2025-01-27T14:30:30.000Z"
}
```

### Download File
Download a file from a bucket
```
GET /:bucketName/files/:fileName
```

Response: File content with appropriate Content-Type header

### Delete File
Delete a file from a bucket
```
DELETE /:bucketName/files/:fileName
```

Response: 204 No Content

### Get File Info
Get metadata about a file
```
GET /:bucketName/files/:fileName/info
```

Example response:
```json
{
  "name": "example.jpg",
  "bucket": "my-bucket",
  "size": 123456,
  "contentType": "image/jpeg",
  "createdAt": "2025-01-27T14:30:30.000Z",
  "updatedAt": "2025-01-27T14:30:30.000Z"
}
```

### List Files in Bucket
List all files in a bucket
```
GET /:bucketName/files
```

Example response:
```json
[
  {
    "name": "example.jpg",
    "bucket": "my-bucket",
    "size": 123456,
    "contentType": "image/jpeg",
    "createdAt": "2025-01-27T14:30:30.000Z",
    "updatedAt": "2025-01-27T14:30:30.000Z"
  }
]
```

## Supported File Types
The storage service supports the following file types with proper MIME type handling:

### Text Files
- .md (text/markdown)
- .txt (text/plain)
- .json (application/json)

### Image Files
- .jpg, .jpeg (image/jpeg)
- .png (image/png)
- .gif (image/gif)
- .webp (image/webp)
- .svg (image/svg+xml)

### Audio Files
- .mp3 (audio/mpeg)
- .wav (audio/wav)
- .ogg (audio/ogg)

### Video Files
- .mp4 (video/mp4)
- .webm (video/webm)
- .mov (video/quicktime)

### Document Files
- .pdf (application/pdf)
- .doc (application/msword)
- .docx (application/vnd.openxmlformats-officedocument.wordprocessingml.document)
- .xls (application/vnd.ms-excel)
- .xlsx (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
- .ppt (application/vnd.ms-powerpoint)
- .pptx (application/vnd.openxmlformats-officedocument.presentationml.presentation)