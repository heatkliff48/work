const fileUpload = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage engine
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('myFile');

// Check file type
function checkFileType(file, cb) {
  const filetypes = /pdf|txt|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'text/plain' ||
    file.mimetype === 'application/msword' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: PDFs and Text Documents Only!');
  }
}

// Upload endpoint
fileUpload.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send(err);
    } else {
      if (req.file == undefined) {
        res.status(400).send('No file selected!');
      } else {
        res.status(200).send(`File uploaded: ${req.file.filename}`);
      }
    }
  });
});

// Download endpoint
fileUpload.get('/download/:filename', (req, res) => {
  const filePath = path.resolve(__dirname, '..', 'uploads', req.params.filename);
  console.log(`Attempting to download file: ${filePath}`);
  res.download(filePath, (err) => {
    if (err) {
      console.error(`Error downloading file: ${err}`);
      res.status(500).send({
        message: 'Could not download the file. ' + err,
      });
    }
  });
});

// Get list of files endpoint
fileUpload.get('/files', (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory: ' + err);
    }
    res.json(files);
  });
});

module.exports = fileUpload;
