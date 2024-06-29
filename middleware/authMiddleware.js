const  {verifyToken}  = require('../config/jwt');

const authMiddleware = async(req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
    try {
        const decoded = await verifyToken(token);
        req.body.id = decoded.id;
        next();
    } catch (err) {
        console.error('Token is not valid:', err);
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
