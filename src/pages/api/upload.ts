import { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import os from "os"; // To get the temporary directory
import ImageKit from "imagekit";

export const readFieldWithFile = (req: NextApiRequest) => {
  const form = new IncomingForm({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

const imagekit = new ImageKit({
  publicKey: "public_rhWJe7IqvYXku1Qg5biyTWAx11g=", // Replace with your public key
  privateKey: "private_+R4vx6hB7jSnYlqgv/dGH/7aDXs=",
  urlEndpoint: "https://ik.imagekit.io/mrinalprakash4577", // Replace with your ImageKit ID
});

export function getFileExtension(fileName: string) {
  const parts = fileName.split(".");
  const extension = parts[parts.length - 1];
  return extension.toLowerCase();
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fields, files } = (await readFieldWithFile(req)) as any;
    if (files.file) {
      const file = files.file[0];
      const extension = getFileExtension(file.originalFilename);
      const sourcePath = file.filepath;

      // Define a temporary directory
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(
        tempDir,
        `upload-${Date.now()}.${extension}`
      );

      // Copy the file to the temporary directory
      fs.copyFileSync(sourcePath, tempFilePath);

      // Print the file path to the console
      console.log("File saved at:", tempFilePath);

      // Read the file content
      const fileData = fs.readFileSync(tempFilePath);

      // Upload to ImageKit
      imagekit.upload(
        {
          file: fileData, //required
          fileName: `upload-${Date.now()}.${extension}`, //required
        },
        function (error, result) {
          if (error) {
            console.error("Error uploading to ImageKit:", error);
            return res
              .status(500)
              .json({ message: "Error uploading to ImageKit", error });
          } else {
            console.log("ImageKit response:", result);
            return res
              .status(200)
              .json({ message: "File uploaded successfully", result });
          }
        }
      );
    } else {
      return res.status(400).json({ message: "No file uploaded" });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Error uploading file", error });
  }
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
