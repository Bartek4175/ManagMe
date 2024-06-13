import { Router } from 'express';
import { Task } from '../models/Task';

const router = Router();

interface GenericError {
    message: string;
}

router.post('/', async (req, res) => {
  const { name, description, priority, storyId, projectId, estimatedTime, status, createdAt, userId, startDate, endDate, assigneeId } = req.body;
  try {
    const newTask = new Task({ name, description, priority, storyId, projectId, estimatedTime, status, createdAt, userId, startDate, endDate, assigneeId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/story/:storyId', async (req, res) => {
  const { storyId } = req.params;
  try {
    const tasks = await Task.find({ storyId });
    res.status(200).json(tasks);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

export default router;
