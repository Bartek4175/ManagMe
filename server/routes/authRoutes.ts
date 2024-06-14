import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User';
import { generateToken } from '../utils/tokenUtils';
import verifyToken from '../middleware/authMiddleware';

const router = Router();
const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const client = new OAuth2Client(googleClientId);

console.log(googleClientId)

let refreshToken: string;

interface GenericError {
    message: string;
}

router.post('/register', async (req, res) => {
  //console.log('test');
  const { login, password, firstName, lastName, role } = req.body;
  try {
    //console.log('test');
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    const newUser = new User({ login, password, firstName, lastName, role });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (err) {
    const error = err as GenericError;
    //console.log(err);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ login, password });
    //console.log(user)
    if (!user) {
      return res.status(404).send('Invalid login or password');
    }
    //console.log(user._id)
    const token = generateToken({ id: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName }, 60 * 15); // 15 minutes
    //console.log(token)
    refreshToken = generateToken({ id: user._id.toString(), role: user.role, firstName: user.firstName, lastName: user.lastName }, 60 * 60 * 24); // 24 hours
    res.status(200).send({ token, refreshToken, user });
  } catch (err) {
    const error = err as GenericError;
    //console.log(err);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/google-login', async (req, res) => {
  const { token: googleToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).send('Invalid Google token');
    }
    let user = await User.findOne({ login: payload.email });
    if (!user) {
      user = new User({
        login: payload.email || '',
        password: '',
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        role: 'developer'
      });
      await user.save();
    }
    const jwtToken = generateToken({ id: user._id.toString(), role: user.role, firstName: user.firstName, lastName: user.lastName }, 60 * 15); // 15 minutes
    const newRefreshToken = generateToken({ id: user._id.toString(), role: user.role, firstName: user.firstName, lastName: user.lastName }, 60 * 60 * 24); // 24 hours
    res.status(200).send({ token: jwtToken, refreshToken: newRefreshToken, user });
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/refreshToken', verifyToken, (req, res) => {
  const { refreshToken: refreshTokenFromPost } = req.body;
  if (refreshToken !== refreshTokenFromPost) {
    return res.status(400).send('Bad refresh token!');
  }
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  const jwtToken = generateToken({ id: req.user.id, role: req.user.role, firstName: req.user.firstName, lastName: req.user.lastName }, 60 * 15); // 15 minutes
  refreshToken = generateToken({ id: req.user.id, role: req.user.role, firstName: req.user.firstName, lastName: req.user.lastName }, 60 * 60 * 24); // 24 hours
  res.status(200).send({ token: jwtToken, refreshToken });
});

export default router;
