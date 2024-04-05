const admin = require('firebase-admin');

const firebase = admin.initializeApp({
    apiKey: process.env.VITE_FIREBASE_API_KEY,
	authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
	projectId: process.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID
});



module.exports = {firebase};

