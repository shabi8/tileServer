const multer  = require('multer');

const storageDestination = './tmp/uploads/';

const storage = multer.diskStorage({
    destination: storageDestination,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).array('files');

module.exports = upload;