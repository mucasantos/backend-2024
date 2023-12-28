const multer = require("multer");

module.exports = {
    fileStorage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "images");
        },
        filename: (req, file, cb) => {
          cb(null, new Date().toISOString() + "-" + file.originalname);
        },
      }),

      fileFiltes:(req, file, cb) => {
        if (
          file.mimetype === "image/png" ||
          file.mimetype === "image/jpg" ||
          file.mimetype === "image/jpge"
        ) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      } 
}
