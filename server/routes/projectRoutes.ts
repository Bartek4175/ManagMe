import { Router } from 'express';
import { Project } from '../models/Project';

const router = Router();

interface GenericError {
    message: string;
}

router.post('/', async (req, res) => {
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

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    const error = err as GenericError;
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

export default router;
