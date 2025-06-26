// Multer middleware with custom Cloudinary integration
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage instead of CloudinaryStorage
const storage = multer.memoryStorage();
const parser = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Custom middleware to upload to Cloudinary
const processCloudinaryUpload = async (req, res, next) => {
  try {
    if (req.file) {
      console.log("Processing file upload to Cloudinary...");
      
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'odin-book',
            public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}`, // Unique filename
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(req.file.buffer);
      });

      req.imageUrl = result.secure_url;
      console.log("Upload successful:", req.imageUrl);
    } else {
      req.imageUrl = null; // No file was uploaded
      console.log("No file to upload");
    }
    
    next(); // Pass control to the next middleware/route handler
  } catch (error) {
    console.error('Upload processing error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image', 
      details: error.message 
    });
  }
};

export { parser, processCloudinaryUpload };