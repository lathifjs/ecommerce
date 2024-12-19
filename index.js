//! 1. Create MVC partan folder --- config, controllers, middleware, models, route and public folder
//! 2. config with mongodb in index.js
//! 3. define user Schema with all info and exports model
//! 4. create controller, wrote all logic and  exports logical function.
//! 5. create Router view and set router and export router


const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/ecom");

const userRoute = require("./routes/userRoute");
app.use('/api', userRoute);

// app.post('/');

const storeRoute = require('./routes/storeRoute');
app.use('/api',storeRoute)

app.listen(3000, function(){
    console.log("Server is Running")
});
