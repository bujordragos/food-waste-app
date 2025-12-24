const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // get token from header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'no token, authorization denied' });

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // add user id to request
        next();
    } catch (err) {
        res.status(401).json({ error: 'token is not valid' });
    }
};
