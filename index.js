const express = require('express');

const youtube = require('./routes/formatToYoutubeShorts');
const getFromVideo = require('./routes/getFromVideo');
const trim = require('./routes/trim');
const convert = require('./routes/convert');
const upload = require('./routes/upload');
const load = require('./routes/load');
const public = require('./routes/public');
const app = express();

// Serve the HTML upload page

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}))
app.use(express.json());

// Start Routes

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