import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing auth token' });
  const token = header.replace('Bearer ', '');

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
