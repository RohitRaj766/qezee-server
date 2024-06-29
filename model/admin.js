const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({}, { strict: false });

const Admin = mongoose.model('Admin', adminSchema, 'admin'); // 'admin' is the name of the collection

module.exports = Admin;