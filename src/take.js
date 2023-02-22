const express = require('express');
const path = require('path');
const app = express();

app.get('/video', (req, res) => {
    const videoUrl = "https://n28.cdnbom.org:82/d/f5rtifygbgeyf3tkcqo5pji7n42pgzmqxyp5ohiznk6tdzmyg42c3n3ih7bvmpuj4moxccrp/_TukTukCinema.net__Code.Name.Banshee.1080p.Bluray.mp4";

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', videoUrl.length);

    res.sendFile(videoUrl);
});

app.listen(3000, () => {
    console.log('Video streaming server running on port 3000');
});
