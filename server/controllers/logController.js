const fs = require('fs');
const path = require('path');

const getLogFiles = (req, res) => {
    const rootDirectory = path.join(__dirname, '../..'); // Directorio raíz

    const directoryPath = rootDirectory;

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send(err);
    }
    const logFiles = files.filter(file => path.extname(file) === '.log');
    const logInfo = logFiles.map(file => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        size: stats.size,
        type: 'TXT'
      };
    });
    res.json({items: logInfo});
  });
};

module.exports = {getLogFiles};