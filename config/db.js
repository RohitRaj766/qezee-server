const mongoose = require('mongoose');
require('dotenv').config();

// mongoose.connect(process.env.MONGO_URL_PRODUCTION, {
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true
// }).then(() => console.log('connected to mongoDB server')).catch((err) => console.error('connection to mongoDB error', err));


mongoose.connect(process.env.MONGO_URL_DEVELOPMENT, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => console.log('connected to mongoDB server')).catch((err) => console.error('connection to mongoDB error', err));



const db = mongoose.connection;

db.on('error', (err) => {
    console.error('mongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('disconnected from mongoDB server');
});

module.exports = db;
