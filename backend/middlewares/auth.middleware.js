import { User } from '../models/user.model.js';
import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied, no token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Role Authorization Middleware
export const roleAuthorization = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }
      next();
    };
};