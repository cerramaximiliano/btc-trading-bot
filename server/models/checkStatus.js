const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    startUnix: {type: Number},
    startArt7: {type: Number},
    startArt10: {type: Number},
    startAtr14: {type: Number},
    startUnixMissingData: {type: Number},
    startUpDown: {type: Number},
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
    updateUpDown: {
        run: Boolean
    },
    firstValues: {
        atr7: Number,
        atr10: Number,
        atr14: Number,
    }
}, {
    collection: 'checkStatus'
})

module.exports = mongoose.model('checkStatus', schema);