import { Router } from 'express';
import { Story } from '../models/Story';

const router = Router();

interface GenericError {
    message: string;
}

router.post('/', async (req, res) => {
  const { name, description, priority, projectId, status, ownerId } = req.body;
  try {
    const newStory = new Story({ name, description, priority, projectId, status, ownerId });
    await newStory.save();
    res.status(201).json(newStory);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  const { projectId } = req.query;
  try {
    const stories = await Story.find({ projectId });
    res.status(200).json(stories);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

export default router;
