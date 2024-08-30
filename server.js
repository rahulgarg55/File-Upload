/**
 * This is a simple Express.js server that handles file uploads using the Multer middleware.
 * 
 * The server has the following routes:
 * - GET / - Serves the index.html file, which likely contains a file upload form.
 * - POST /upload - Handles the file upload using Multer. The uploaded file is saved to the 'uploads' directory.
 * 
 * The server also serves the uploaded files from the 'uploads' directory using the '/uploads' route.
 */
const express = require("express");
const multer = require("multer");   
const path = require("path");
const fs = require("fs");  
const helmet = require('helmet');

const morgan = require('morgan');


const app = express();
app.use(helmet());
app.use(morgan('combined'));



const storage = multer.diskStorage({
    destination:(req,file, cb)=>{
        const uploadDir = 'uplods';
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        cb(null,uploadDir);
    },
    filename: (req,file, cb)=>{
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

app.use('/uploads', express.static('uploads'));

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send(`File uploaded successfully: ${req.file.filename}`);
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});