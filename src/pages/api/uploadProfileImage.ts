import AWS from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export default async function uploadProfileImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { file, fileName } = req.body;

      const buffer = Buffer.from(file, "base64"); // if the file is sent as a base64-encoded string

      const params = {
        Bucket: process.env.BUCKET_NAME!,
        Key: fileName,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: "image/jpeg", // Adjust as necessary
      };

      const data = await s3.upload(params).promise();
      res.status(200).json({ url: data.Location });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "File upload failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
