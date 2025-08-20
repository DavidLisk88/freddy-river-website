import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export const storage = {
  async uploadFile(key: string, file: Buffer, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: file,
      ContentType: contentType,
    })

    await s3Client.send(command)
    return key
  },

  async getSignedDownloadUrl(key: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    })

    return await getSignedUrl(s3Client, command, { expiresIn })
  },

  getPublicUrl(key: string) {
    return `${process.env.R2_PUBLIC_URL}/${key}`
  }
}