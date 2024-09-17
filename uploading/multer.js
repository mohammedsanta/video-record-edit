const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req,file,cb) {
        console.log(file)
        cb(null,'uploaded' + file.originalname )
    }
});

exports.upload = multer({ storage });