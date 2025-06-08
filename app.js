const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'https://singular-meringue-100b8e.netlify.app/',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); 

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;