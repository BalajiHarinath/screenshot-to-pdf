const express = require('express');
const cors = require('cors');
const multer = require('multer');
// const fs = require('fs');
const PDFDocument = require('pdfkit');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/mergeAndDownload', upload.array('screenshots', 15), (req, res) => {
    try{
        const screenshots = req.files;
        const { password, file_name } = req.body;
        if(!password){
            throw new Error('File password is required.');
        }
        if(!file_name){
            throw new Error('File name is required.');
        }
        // Create a PDF and add screenshots to it
        const doc = new PDFDocument({userPassword: password});
        doc.pipe(res);
        doc.info['Title'] = 'Test title';
        doc.info['Author'] = 'Test Author';
        screenshots.forEach((screenshot, index) => {
            if (index > 0) {
                // If not the first screenshot, add a new page
                doc.addPage();
              }
          
              // Add the screenshot to the page
              doc.image(screenshot.buffer, 5, 5, { width: 600 });
        });
        doc.end();
    }
catch(err){
    console.log(err, 'err in merge and download');
    res.status(500).json({status: false, message: err});
}
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});