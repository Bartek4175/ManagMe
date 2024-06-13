import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const tokenSecret = process.env.TOKEN_SECRET as string;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(403);

  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: err.message });
    }
    req.user = user as JwtPayload & { id: string; role: string; firstName: string; lastName: string };
    next();
  });
};

export default verifyToken;
