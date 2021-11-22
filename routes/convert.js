const express = require('express');
const router = express.Router();
const multer  = require('multer');
const obj23dtiles = require('obj23dtiles');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const zip = require('express-zip');




const storageDestination = './tmp/uploads/'



const storage = multer.diskStorage({
    destination: storageDestination,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).array('files');

const obj23dtilesPromise = (objPath, tilesetPath, options) => {
    return new Promise((resolve, reject) => {
        obj23dtiles(objPath, tilesetPath, { tileset: true, tilesetOptions: options })
        
        resolve()
    });
}


const convertO2T = async (req, res, next) => {
    const files = fs.readdirSync(storageDestination);

    const options = JSON.parse(req.body.options);

    if (files.length > 0) {
        const objPath = path.join(storageDestination ,path.parse(files[0]).name + '.obj');

        const tilesetPath = path.join(storageDestination, path.parse(req.files[0].originalname).name + '.b3dm');

        const convert = await obj23dtilesPromise(objPath, tilesetPath, { tileset: true, tilesetOptions: options });
        console.log('yo', convert)
    }
    next();
    
}

const download = (req, res, next) => {
    let filesToZipList = [];
    const watcher = chokidar.watch(storageDestination, {ignored: /^\./, persistent: true});
    watcher.on('addDir', (patha) => {
        console.log(patha)
        const batchedFolderPath = path.join(storageDestination, `Batched${path.parse(req.files[0].originalname).name}`);
        const batchedFolder = fs.readdirSync(batchedFolderPath);
        console.log(batchedFolder);
        batchedFolder.forEach( file => {
            const tile = {
                path: path.join(batchedFolderPath, file),
                name: file
            }
            filesToZipList.push(tile);
        });
        console.log(filesToZipList);
        res.locals.filesToZipList = filesToZipList;
        
    })

    next()
}



router.get('/totileset', (req, res) => {
    console.log('whats up');
    res.send('OK');
});


router.post('/totileset', upload, convertO2T, download,(req, res) => {

    
    try {
        res.send('ok');;
    } catch {
        console.log('error')
        res.send('error');
    }
})


module.exports = router;


