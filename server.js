//import express module
const express = require('express');

const cors = require('cors');
//use express in app variable
const app = express();
app.use(cors());

const router = require('./src/routes/router');

app.use(express.json());
app.use(express.static('public'));

app.use('/api/v1/', router);

//import env

//define the server port
const port = 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
