const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    console.log('Hello')
    if (!token) return res.status(403).json({ message: 'Access denied, no token provided' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;  // Attach user info to request
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
