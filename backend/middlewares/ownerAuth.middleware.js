import jwt from 'jsonwebtoken';

export const verifyOwnerJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "Owner") throw new Error();
    req.owner = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Forbidden (Owner only)" });
  }
};


