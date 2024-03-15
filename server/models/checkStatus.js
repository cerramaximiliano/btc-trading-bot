const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    startUnix: {type: Number},
    startArt7: {type: Number},
    startUnixMissingData: {type: Number},
    missingData: {type: Array},
    missingDataHandled: {type: Array},
    lastUnixRecord: {type: Number},
    checkCompleteness: {
        run: Boolean
    },
    updateMissingData: {
        run: Boolean
    },
    updateWrongData: {
        run: Boolean
    },
    updateAtr: {
        run: Boolean
    },
    firstValues: {
        atr7: Number
    }

}, {
    collection: 'checkStatus'
})

module.exports = mongoose.model('checkStatus', schema);