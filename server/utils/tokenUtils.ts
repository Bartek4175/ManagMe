import jwt, { JwtPayload } from 'jsonwebtoken';

const tokenSecret = process.env.TOKEN_SECRET as string;

export function generateToken(payload: JwtPayload & { id: string; role: string; firstName: string; lastName: string }, expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
  const token = jwt.sign({ ...payload, exp }, tokenSecret, { algorithm: 'HS256' });
  return token;
}