const obj23dtiles = require('obj23dtiles');
const path = require('path');
const fs = require('fs');

const storageDestination = './tmp/uploads/';

const obj23dtilesPromise = (objPath, tilesetPath, options) => {
    return new Promise((resolve, reject) => {
        obj23dtiles(objPath, tilesetPath, { tileset: true, tilesetOptions: options })
        
        resolve()
    });
}


const convertO2T = async (req, res, next) => {
    try{
        const files = fs.readdirSync(storageDestination);

        const options = JSON.parse(req.body.options);

        if (files.length > 0) {
            const objPath = path.join(storageDestination ,path.parse(files[0]).name + '.obj');

            const tilesetPath = path.join(storageDestination, path.parse(req.files[0].originalname).name + '.b3dm');

            const convert = await obj23dtilesPromise(objPath, tilesetPath, { tileset: true, tilesetOptions: options });

            const convertedFolderPath = path.join(storageDestination, `Batched${path.parse(req.files[0].originalname).name}`);

            const convertedFiles = [
                path.join(convertedFolderPath, path.parse(req.files[0].originalname).name + '.b3dm'),
                path.join(convertedFolderPath, 'tileset.json')
            ]

            req.convertedFilesPath = convertedFiles;

            console.log(convertedFiles);
        }
        next();
    } catch (error) {
        console.log(error);
        res.send(error);
    }
    
    
}

module.exports = convertO2T;
