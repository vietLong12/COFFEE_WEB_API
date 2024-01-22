const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: 'dxx3yfsyc',
    api_key: '425859424738119',
    api_secret: "FZ8jNTX8hNj9rJbIUAPb6d_H-lY"
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
