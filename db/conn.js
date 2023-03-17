const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1/socialApp").then(() => {
    console.log("Connection Successfull");
}).catch((err) => {
    console.log(err);
})