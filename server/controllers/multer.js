// Multer middleware to make it possible to attach files

import multer from "multer";

const storage = multer.memoryStorage(); // Store file in RAM buffer

const upload = multer({ storage });

export default upload;
