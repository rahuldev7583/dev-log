import type { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/token';

export const validateUser = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const data = verifyToken(token);
  if (!data) {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  req.user = data;

  next();
};
