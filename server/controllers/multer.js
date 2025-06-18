// Multer middleware to make it possible to attach files

import multer from "multer";

// const storage = multer.memoryStorage(); // Store file in RAM buffer

// const upload = multer({ storage });

// export default upload;

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "odin-book",
    // format: async (req, file) => 'png',  supports promises as well
    public_id: (req, file) => "computed-filename-using-request",
  },
});

const parser = multer({ storage: storage });

const processCloudinaryUpload = (req, res, next) => {
  console.log("req.file", req.file)
  if (req.file) {
    req.imageUrl = req.file.path;
  } else {
    req.imageUrl = null; // No file was uploaded
  }
  next(); // Pass control to the next middleware/route handler
};

export { parser, processCloudinaryUpload };
