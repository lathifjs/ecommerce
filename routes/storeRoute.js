const express = require("express");
const storeRoute = express();
const multer = require('multer');
const path = require("path");
const auth = require('../middleware/auth');
const storeController = require('../controllers/storeController'); 




const bodyParser = require("body-parser");
storeRoute.use(bodyParser.json());
storeRoute.use(bodyParser.urlencoded({extended:true}));


storeRoute.use(express.static('public'))
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cd(null,path.join(__dirname,'../public/storeImages', function(error,success){
            if(error) throw error
        }));
    },
    filename:function(req,file,cb){
      const name =  Date.now()+'-'+file.originalname;
      cb(null, name,function(error,message){
        if(error) throw error
      });

    }
});

const upload = multer({storage:storage});


storeRoute.post('/create-store',auth,upload.single('logo'),storeController.createStore)





module.exports = storeRoute;