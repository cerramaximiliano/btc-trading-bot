const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';

function generateRandomKey(length) {
    let key = '';
    for (let i = 0; i < length; i++) {
      key += validChars.charAt(Math.floor(Math.random() * validChars.length));
    }
    return key;
};

module.exports = {generateRandomKey};
  