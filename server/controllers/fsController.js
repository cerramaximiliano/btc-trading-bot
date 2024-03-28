const fs = require('fs');
const { logger } = require('../config/pino');
const path = require('path');
const root = path.resolve(__dirname, '../../');

async function deleteFile (file){
    console.log(file)
    try {
        const fileRoot = path.join(root, file);
        await fs.promises.unlink(fileRoot)
        logger.info(`[fsCrontroller]: delete file ${file} successful`)
    }catch(err){
        logger.error(`[fsCrontroller]: couldn't delete ${file}`)
        throw new Error()
    }
}


module.exports = deleteFile;