const multer = require('multer');
const upload = multer({ dest: process.env.UPLOAD_TEMP_DIR || './uploads' });
module.exports = upload;
