const express = require('express');
const app = express();
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const app = require('./app');

// configure cors
app.use(cors());

// configure express to receive the form data
app.use(express.json());

// configure dotEnv
dotEnv.config({path : './config.env'});
const hostname = process.env.LOCAL_HOST_NAME;
const port = process.env.LOCAL_PORT;

// connect to Mongo DB
mongoose.connect(process.env.DATABASE, {
    useFindAndModify : false,
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
}).then((response) => {
    console.log(`Connected to MongoDB successfully`);
}).catch((error) => {
    console.error(error);
    process.exit(1);
});


app.listen(port, hostname, () => {
    console.log(`Server is started at http://${hostname}:${port}`);
});
