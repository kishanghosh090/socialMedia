import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now().toLocaleString();
    cb(null, file.originalname + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
export { upload };
