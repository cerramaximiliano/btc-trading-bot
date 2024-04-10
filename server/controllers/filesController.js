const fs = require('fs');
const path = require('path');

const getFiles = (req, res) => {
    const rootDirectory = path.join(__dirname, '../..'); // Directorio raíz
    const logDirectoryPath = rootDirectory;
    const filesDirectoryPath = path.join(__dirname, '../../server/files'); // Ruta a la carpeta de archivos

    // Función para leer los archivos de un directorio y retornar la información
    const readFilesFromDirectory = (directoryPath, fileType) => {
        return new Promise((resolve, reject) => {
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    let filteredFiles;
                    // Si es el directorio de logs, filtrar solo archivos .log
                    if (directoryPath === logDirectoryPath) {
                        filteredFiles = files.filter(file => path.extname(file) === '.log');
                    } else {
                        filteredFiles = files;
                    }

                    const fileInfo = filteredFiles.map((file, index) => {
                        const filePath = path.join(directoryPath, file);
                        const stats = fs.statSync(filePath);

                        let fileType = 'TXT'; // Por defecto, se asume que es un archivo de texto

                        const ext = path.extname(file).toLowerCase();
                        // Verificar el tipo de archivo según la extensión
                        if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'].includes(ext)) {
                            fileType = 'JPG';
                        } else if (['.doc', '.docx', '.rtf'].includes(ext)) {
                            fileType = 'DOC';
                        } else if (ext === '.pdf') {
                            fileType = 'PDF';
                        } else if (['.xls', '.xlsx'].includes(ext)) {
                            fileType = 'XLS';
                        }

                        // Calcular el tamaño del archivo en MB o KB
                        const fileSizeInBytes = stats.size;
                        let fileSize;
                        if (fileSizeInBytes >= 1024 * 1024) {
                            fileSize = (fileSizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
                        } else {
                            fileSize = (fileSizeInBytes / 1024).toFixed(2) + ' KB';
                        }

                        // Generar un ID único basado en el nombre del archivo y su extensión
                        const uniqueId = `${file}-${ext}-${index}`;

                        return {
                            id: uniqueId,
                            name: file,
                            createdAt: stats.birthtime,
                            modifiedAt: stats.mtime,
                            size: fileSize,
                            type: fileType
                        };
                    });
                    resolve(fileInfo);
                }
            });
        });
    };

    // Promesas para leer los archivos de ambas carpetas
    Promise.all([
        readFilesFromDirectory(logDirectoryPath, 'TXT'), // Carpeta de archivos de logs
        readFilesFromDirectory(filesDirectoryPath, 'FILES') // Carpeta de archivos adicionales
    ])
    .then(([logFiles, additionalFiles]) => {
        const combinedFiles = [...logFiles, ...additionalFiles]; // Combinar la información de ambos tipos de archivos
        res.json({ items: combinedFiles });
    })
    .catch(err => {
        res.status(500).send(err);
    });
};

module.exports = { getFiles };
