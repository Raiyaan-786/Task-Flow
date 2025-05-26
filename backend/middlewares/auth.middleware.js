import jwt from "jsonwebtoken"

export const verifyJWT = async (req, res, next) => {
  const authHeader = req.header('Authorization');  

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied, no token provided or incorrect format' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token' });
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