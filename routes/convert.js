const express = require('express');
const router = express.Router();
const convertO2T = require('../middleware/convertObjToTileset');


const upload = require('../middleware/upload')


router.get('/totileset', (req, res) => {
    console.log('whats up');
    res.send('OK');
});


router.post('/totileset', upload, convertO2T,(req, res) => {
    try {
        console.log(req.convertedFilesPath);
        res.json(req.convertedFilesPath);
    } catch {
        console.log('error')
        res.send('error');
    }
})


module.exports = router;


