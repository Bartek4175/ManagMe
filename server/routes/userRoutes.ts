import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

interface GenericError {
    message: string;
}

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/login/:login', async (req, res) => {
  const login = req.params.login;
  try {
    const user = await User.findOne({login: login});
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;
