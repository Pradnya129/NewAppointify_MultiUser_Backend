const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'landing';
    if (file.fieldname === 'section2_Image') {
      folder = 'section2Image';
    }
    const dest = path.join(__dirname, '..', 'public', 'uploads', folder);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '')}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
