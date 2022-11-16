import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';


const db   = process.env.MONGODB_URI || 'mongodb://127.0.0.1/fileupload';
const port = process.env.PORT        || 4000;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log(`DB connected @ ${db}`);
  })
.catch(err => console.error(`Connection error ${err}`));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const limits = {
  fileSize: 2 * 1024 * 1024
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png")
    cb(null, true);
  else cb(null, false);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});


const PhotoSchema = new mongoose.Schema({
  title: String,
  date: { type: Date, default: Date.now },
  image: String
});

const Photo = mongoose.model('Photo', PhotoSchema);


app.post('/uploads', upload.single("image"), (req, res) => {
  const photo = new Photo({
    title: req.body.title,
    image: req.file.path
  });
  photo.save(err => {
    res.status(201).json(photo);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
