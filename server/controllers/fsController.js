const fs = require('fs');
const { logger } = require('../config/pino');
const path = require('path');
const root = path.resolve(__dirname, '../../');

async function deleteFile (file){
    console.log(file)
    try {
        const fileRoot = path.join(root, file);
        if ( fs.existsSync(fileRoot) ){
            await fs.promises.unlink(fileRoot)
            logger.info(`[fsCrontroller]: delete file ${file} successful`)

        }else{
            logger.warn(`[fsCrontroller]: couldn't found ${file}`)
        }
    }catch(err){
        console.log(err)
        logger.error(`[fsCrontroller]: couldn't delete ${file}`)
        throw new Error(err)
    }
}


module.exports = deleteFile;