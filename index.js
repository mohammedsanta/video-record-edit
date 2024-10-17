const express = require('express');
const cookieParser = require('cookie-parser');

const youtube = require('./routes/formatToYoutubeShorts');
const getFromVideo = require('./routes/getFromVideo');
const trim = require('./routes/trim');
const convert = require('./routes/convert');
const upload = require('./routes/upload');
const load = require('./routes/load');
const public = require('./routes/public');
const auth = require('./routes/auth');
const video = require('./routes/video');
const session = require('./routes/session');
const cors = require('cors');
const { connection } = require('./config/db');

const app = express();

connection()

// Serve the HTML upload page
// app.use(cors())
app.use(express.urlencoded({ extended: true}))
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

// Start Routes

app.use('/auth',auth)
app.use('/',video)
app.use('/',session)
app.use('/shorts',youtube);
app.use('/video',getFromVideo)
app.use('/cut',trim)
app.use('/convert',convert)
app.use('/upload',upload)
app.use('/',load)
app.use('/',public)

// End Routes

app.listen(3000,() => {
    console.log('server working')
})