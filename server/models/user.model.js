const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
    },
    {
        collection: 'users'
    }
);

module.exports = mongoose.model('users', UserSchema);