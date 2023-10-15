require('dotenv').config({ path: './file.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('./login/passportConfig')(passport);
const mongoString = process.env.DATABASE_URL;

const app = express();

const jwt = require('jsonwebtoken');

const routes = require('./routes/routes');

mongoose.connect(mongoString);
const database = mongoose.connection;


database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.use(cors());

app.use(express.json());


app.use('/api', routes);

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server Started at ` + PORT)
})