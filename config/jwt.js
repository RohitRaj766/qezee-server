const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async (user) => {
    try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return token;
    } catch (error) {
        throw error;
    }
};

const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw error;
    }
};

module.exports = { generateToken, verifyToken };
