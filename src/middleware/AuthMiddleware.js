import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export class AuthMiddleware {
    constructor(parameters) {

    }

    verifyToken = async (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    };

    // Middleware de autorização por role
    authorize = (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ message: 'Not authenticated' });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
            }

            next();
        };
    };


}