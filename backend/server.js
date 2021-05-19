const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const proxy = require('http-proxy-middleware')

const apiProxy = proxy(['/api' ], { target: 'http://localhost:5000' });

app.use(apiProxy)
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } );
//to add connection to mongoose

const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log("MongoDB Database connection enstablished successfully")
})

const postingRouter = require('./routes/posts');
const userRouter = require('./routes/users');
const videoRouter = require('./routes/videos');

//adding path to users and stock list

app.use('/users', userRouter);
app.use('/videos', videoRouter);
app.use('/posts', postingRouter);

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});
