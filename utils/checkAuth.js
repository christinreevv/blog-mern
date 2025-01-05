import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (!token) {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }

    try {
        const decoded = jwt.verify(token, 'secret123'); // используйте тот же секрет, что и при создании токена
        req.userId = decoded._id;
        next();
    } catch (err) {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
};

export default checkAuth;
