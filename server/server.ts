import express, { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
import mongoose, { ConnectOptions } from 'mongoose';
import { User } from './models/User';
import { Project } from './models/Project';
import { Story } from './models/Story';
import { Task } from './models/Task';

const app = express();
const port = 3000;

const tokenSecret = process.env.TOKEN_SECRET as string;
const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const client = new OAuth2Client(googleClientId);

let refreshToken: string;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string, { } as ConnectOptions).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

interface GenericError {
  message: string;
}

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World - simple api with JWT!');
});

app.post('/register', async (req: Request, res: Response) => {
  const { login, password, firstName, lastName, role } = req.body;
  try {
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    const newUser = new User({ login, password, firstName, lastName, role });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ login, password });
    if (!user) {
      return res.status(401).send('Invalid login or password');
    }

    const token = generateToken({ id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName }, 60 * 15); // 15 minutes
    refreshToken = generateToken({ id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName }, 60 * 60 * 24); // 24 hours

    res.status(200).send({ token, refreshToken, user });
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.post('/google-login', async (req: Request, res: Response) => {
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

    const jwtToken = generateToken({ id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName }, 60 * 15); // 15 minutes
    const newRefreshToken = generateToken({ id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName }, 60 * 60 * 24); // 24 hours

    res.status(200).send({ token: jwtToken, refreshToken: newRefreshToken, user });
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
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

app.post('/refreshToken', verifyToken, (req: Request, res: Response) => {
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
      return res.status(401).json({ message: err.message });
    }
    req.user = user as JwtPayload & { id: string; role: string, firstName: string, lastName: string };
    next();
  });
}

// Projects
app.post('/projects', async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    const newProject = new Project({ name, description });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/projects', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).send('Project not found');
    }
    res.status(200).json(project);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.put('/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(id, { name, description }, { new: true });
    if (!project) {
      return res.status(404).send('Project not found');
    }
    res.status(200).json(project);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.delete('/projects/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).send('Project not found');
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
// Stories

app.post('/stories', async (req: Request, res: Response) => {
  const { name, description, priority, projectId, status, ownerId } = req.body;
  try {
    const newStory = new Story({ name, description, priority, projectId, status, ownerId });
    await newStory.save();
    res.status(201).json(newStory);
  } catch (err) {
    console.error('Error creating story:', err); // Log the error to see the details
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/stories', async (req: Request, res: Response) => {
  const { projectId } = req.query;
  try {
    const stories = await Story.find({ projectId });
    res.status(200).json(stories);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/stories/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).send('Story not found');
    }
    res.status(200).json(story);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.put('/stories/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, priority, status } = req.body;
  try {
    const story = await Story.findByIdAndUpdate(id, { name, description, priority, status }, { new: true });
    if (!story) {
      return res.status(404).send('Story not found');
    }
    res.status(200).json(story);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.delete('/stories/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const story = await Story.findByIdAndDelete(id);
    if (!story) {
      return res.status(404).send('Story not found');
    }
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
// Tasks
app.post('/tasks', async (req: Request, res: Response) => {
  const { name, description, priority, storyId, projectId, estimatedTime, status, createdAt, userId, startDate, endDate, assigneeId } = req.body;
  try {
    const newTask = new Task({ name, description, priority, storyId, projectId, estimatedTime, status, createdAt, userId, startDate, endDate, assigneeId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    //console.error('Error creating tasks:', err); 
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/tasks/story/:storyId', async (req: Request, res: Response) => {
  const { storyId } = req.params;
  try {
    const tasks = await Task.find({ storyId });
    res.status(200).json(tasks);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.status(200).json(task);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.put('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, priority, storyId, projectId, estimatedTime, status, createdAt, userId, startDate, endDate, assigneeId } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(id, { name, description, priority, storyId, projectId, estimatedTime, status, createdAt, userId, startDate, endDate, assigneeId }, { new: true });
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.status(200).json(task);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


