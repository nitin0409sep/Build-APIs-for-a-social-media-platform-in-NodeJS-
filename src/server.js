// Express
const express = require('express');

// App
const app = express();

// Port
const port = process.env.PORT || 80;

// DB Connection
require('../db/conn');

// Routes
const route = require('../controller/controller');

// Middle Ware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(route);

// Port 
app.listen(port, () => {
    console.log(`Server has started at port ${port}`);
})