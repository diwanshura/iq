import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err.message.includes('duplicate key')) {
    return res.status(400).json({ error: 'Email or username already exists' });
  }

  if (err.message.includes('validation')) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
};

export default errorHandler;
