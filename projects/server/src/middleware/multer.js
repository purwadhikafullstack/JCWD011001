const multer = require("multer");
const path = require("path");
const fs = require("fs");

let defaultPath = path.join(__dirname, "../../public");
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const isDirectoryExist = fs.existsSync(`${defaultPath}/${file.fieldname}`);
    if (!isDirectoryExist)
      await fs.promises.mkdir(`${defaultPath}/${file.fieldname}`, {
        recursive: true,
      });
    cb(null, `${defaultPath}/${file.fieldname}`);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}` +
        "-" +
        Date.now() +
        Math.round(Math.random() * 100000) +
        "." +
        file.mimetype.split("/")[1]
    );
  },
});

const maxSize = 1 * 1000 * 1000;
const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split("/")[1];
  if (
    fileType === "png" ||
    fileType === "jpeg" ||
    fileType === "jpg" ||
    fileType === "gif"
  ) {
    cb(null, true);
  } else {
    cb("File format is not accepted, Format: .png, .jpg, and .gif");
  }
};

exports.multerUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: maxSize },
});
