import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const port = 3000;

const tokenSecret = process.env.TOKEN_SECRET as string;
let refreshToken: string;

app.use(cors());
app.use(express.json());

// Mock users
const users: { id: number, login: string, password: string, firstName: string, lastName: string, role: string }[] = [
  { id: 1, login: 'admin', password: 'password', firstName: 'Maciej', lastName: 'Kowalski', role: 'admin' },
  { id: 2, login: 'devops', password: 'password', firstName: 'Andrzej', lastName: 'Tomaszewski', role: 'devops' },
  { id: 3, login: 'developer', password: 'password', firstName: 'Bartłomiej', lastName: 'Paluch', role: 'developer' }
];

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World - simple api with JWT!');
});

app.post('/register', (req: Request, res: Response) => {
  const { login, password, firstName, lastName, role } = req.body;
  if (users.find(user => user.login === login)) {
    return res.status(400).send('User already exists');
  }
  const newUser = { id: users.length + 1, login, password, firstName, lastName, role: role || 'developer' };
  users.push(newUser);
  res.status(201).send('User registered');
});

app.post('/login', (req: Request, res: Response) => {
  const { login, password } = req.body;

  const user = users.find(u => u.login === login && u.password === password);
  if (!user) {
    return res.status(401).send('Invalid login or password');
  }

  const token = generateToken({ id: user.id.toString(), role: user.role, firstName: user.firstName, lastName: user.lastName }, 60 * 15); // 15 minutes
  refreshToken = generateToken({ id: user.id.toString(), role: user.role, firstName: user.firstName, lastName: user.lastName }, 60 * 60 * 24); // 24 hours

  res.status(200).send({ token, refreshToken });
});

app.get('/users', (req: Request, res: Response) => {
  res.status(200).json(users);
});

app.get('/users/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).send('User not found');
  }
  res.status(200).json(user);
});

app.post('/refreshToken', (req: Request, res: Response) => {
  const { refreshToken: refreshTokenFromPost } = req.body;

  if (refreshToken !== refreshTokenFromPost) {
    return res.status(400).send('Bad refresh token!');
  }

  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }

  const token = generateToken({ id: req.user.id, role: req.user.role, firstName: req.user.firstName, lastName: req.user.lastName }, 60 * 15); // 15 minutes
  refreshToken = generateToken({ id: req.user.id, role: req.user.role, firstName: req.user.firstName, lastName: req.user.lastName }, 60 * 60 * 24); // 24 hours

  res.status(200).send({ token, refreshToken });
});

app.get('/protected/:id/:delay?', verifyToken, (req: Request, res: Response) => {
  const id = req.params.id;
  const delay = req.params.delay ? +req.params.delay : 1000;
  setTimeout(() => {
    res.status(200).send(`{"message": "protected endpoint ${id}"}`);
  }, delay);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function generateToken(payload: JwtPayload & { id: string; role: string, firstName: string, lastName: string }, expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
  const token = jwt.sign({ ...payload, exp }, tokenSecret, { algorithm: 'HS256' });
  return token;
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(403);

  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).send(err.message);
    }
    req.user = user as JwtPayload & { id: string; role: string, firstName: string, lastName: string };
    next();
  });
}
