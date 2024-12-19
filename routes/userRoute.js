const express = require("express");
const userRoute = express();

const userController = require('../controllers/userController');


const bodyParser = require("body-parser");
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({extended:true}));

const multer = require("multer");
const path = require("path");

userRoute.use(express.static('public'));

const auth = require('../middleware/auth');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, path.join(__dirname,'../public/userImages'), function(error, success){
            if(error) throw error;
        });
    },
    filename:function(req,file,cb){
       const imageName = Date.now()+'-'+ file.originalname;
       cb(null,imageName,function(error,success){
        if(error) throw error;
       })

    }


});

const upload = multer({storage:storage});



userRoute.post('/register',upload.single('image'),userController.registerUser);
userRoute.post('/login',userController.userLogin);

// userRoute.get('/test',auth,function(req,res){
//     res.status(200).send({success:true, message:"Authenticate"})
// });

userRoute.post('/update-password',auth,userController.updatePassword);
userRoute.post('/forget-password',userController.forgetPassword);
userRoute.get('/reset-password',userController.resetPassword);







module.exports = userRoute;
