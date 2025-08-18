// controllers/uploadController.js
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // dpt0cbqxm
  api_key: process.env.CLOUDINARY_API_KEY,       // 962218246438834
  api_secret: process.env.CLOUDINARY_API_SECRET  // vW5CsyH...
});


const streamUploadToCloudinary = (buffer, folder = '') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

exports.uploadAvatar = async (req, res, next) => {
  try {
    // debug log
    console.log('uploadAvatar called. req.file =', !!req.file, req.file && Object.keys(req.file));

    if (!req.file || !req.file.buffer) {
      const err = new Error('No file provided or file buffer missing (check multer memory storage and field name)');
      err.status = 400;
      throw err;
    }

    const result = await streamUploadToCloudinary(req.file.buffer, 'avatars');
    return res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('UploadAvatar error:', err && err.stack ? err.stack : err);
    // dev-only: return full stack so you can see the exact failure
    return res.status(err.status || 500).json({ error: err.message, stack: err.stack });
  }
};

exports.uploadCover = async (req, res, next) => {
  try {
    console.log('uploadCover called. req.file =', !!req.file);
    if (!req.file || !req.file.buffer) {
      const err = new Error('No file provided or file buffer missing (check multer memory storage and field name)');
      err.status = 400;
      throw err;
    }
    const result = await streamUploadToCloudinary(req.file.buffer, 'covers');
    return res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('UploadCover error:', err && err.stack ? err.stack : err);
    return res.status(err.status || 500).json({ error: err.message, stack: err.stack });
  }
};
