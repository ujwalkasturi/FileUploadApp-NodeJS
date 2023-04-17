const express = require('express');
const router = express.Router();
const FileUpload = require('../models/files.js');
const multer = require('multer');
const fs = require('fs');

// File Upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
})

var upload = multer({
    storage: storage,
}).single('uploadfile');

// Insert file into db route

router.post('/addFile', upload, async (req, res) => {
    try {
        const file = new FileUpload({
            userName: req.body.name,
            fileImage: req.file.filename
        })
        await file.save();
        req.session.message = {
            type: 'success',
            message: 'File uploaded successfully'
        }
        res.redirect("/");
    } catch (err) {
        res.json({message: err.message, type: 'danger'});
    }
})

// router.get('/', (req,res) => {
//     FileUpload.find().exec((err, files) => {
//         if(err)
//         {
//             res.json({message: err.message, type: 'danger'});
//         } else {
//             res.render('index',{
//                 title: 'Home Page',
//                 files: files
//             })
//         }
//     })
// })

router.get('/', async (req,res) => {
    try {
        const files = await FileUpload.find().exec();
        res.render('index',{
            title: 'Home Page',
            files: files
        });
    } catch (err) {
        res.json({message: err.message, type: 'danger'});
    }
});

router.get('/addFile',(req,res) => {
    res.render('addFile', {title: 'Add File'});
});

router.get('/edit/:id', async (req,res) => {
    let id = req.params.id;
    try {
        const files = await FileUpload.findById(id)
        if(files == null) {
            res.redirect('/');
        } else {
            res.render('editFile', {
                title: 'Edit File',
                files: files
            })
        }
    } catch(er) {
        res.redirect('/');
    }
    
})

// edit file

// router.post('/update/:id', upload, (req,res) => {
//     let id = req.params.id;
//     let new_file = "";

//     if(req.file){
//         new_file = req.file.filename;
//         try{
//             fs.unlinkSync('./uploads/'+req.body.old_file)
//         }
//         catch(err){
//             console.log(err);
//         }
//     } else {
//         new_file = req.body.old_file;
//     }

//     // try{
//     //     FileUpload.findByIdAndUpdate(id, {
//     //         userName: req.body.userName,
//     //         fileImage: new_file
//     //     })

//     //     req.session.message = {
//     //         type: 'success',
//     //         message: 'User updated successfully'
//     //     }

//     //     res.redirect("/")

//     // } catch (err) {
//     //     res.json({message: err.message, type: 'danger'});
//     // }

//     FileUpload.findByIdAndUpdate(id, {
//         userName: req.body.userName,
//         fileImage: new_file
//     }, (err, result) => {
//         if (err) {
//             res.json({message: err.message, type: 'danger'});
//         }
//         else {
//             req.session.message = {
//                 type: 'success',
//                 message: 'User updated successfully'
//             }
    
//             res.redirect("/")
//         }
//     })
    

// })

router.post('/update/:id', upload, async (req,res) => {
    let id = req.params.id;
    let new_file = "";

    if(req.file){
        new_file = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_file)
        }
        catch(err){
            console.log(err);
        }
    } else {
        new_file = req.body.old_file;
    }
    
    try {
        const updatedFile = await FileUpload.findByIdAndUpdate(id, {
            userName: req.body.name,
            fileImage: new_file
        });
        req.session.message = {
            type: 'success',
            message: 'File updated successfully'
        };
        res.redirect("/");
    } catch (err) {
        res.json({message: err.message, type: 'danger'});
    }
});

// router.get('/delete/:id', (req, res) => {
//     let id = req.params.id;

//     // try {
//     //     const file = FileUpload.findByIdAndRemove(id);
        
//     //     fs.unlinkSync('./uploads/'+file.userName)
//     //     req.session.message = {
//     //         type: 'success',
//     //         message: 'File Deleted successfully'
//     //     };
//     //     res.redirect("/");
//     // }
//     // catch (err) {
//     //     res.json({message: err.message, type: 'danger'});
//     // }
//     FileUpload.findByIdAndRemove(id).exec((err, result) => {
//         if(result.fileImage != ''){
//             try{
//                 fs.unlinkSync('./uploads/'+result.fileImage)
//             } catch(err){
//                 console.log(err);
//             }
//         }
//         if(err)
//         {
//             res.json({message: err.message, type: 'danger'});
//         } else {
//             req.session.message = {
//                 type: 'success',
//                 message: 'File Deleted successfully'
//             };
//             res.redirect("/");
//         }
//     })
// })
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const result = await FileUpload.findByIdAndRemove(id);
  
      if (result.fileImage) {
        fs.unlinkSync('./uploads/' + result.fileImage);
      }
  
      req.session.message = {
        type: 'success',
        message: 'File Deleted successfully'
      };
      res.redirect("/");
    } catch (err) {
      res.json({ message: err.message, type: 'danger' });
    }
  });
module.exports = router;