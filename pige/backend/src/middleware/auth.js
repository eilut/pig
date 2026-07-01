import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev';

export function authenticateAdmin(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
}
