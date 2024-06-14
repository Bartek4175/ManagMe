import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addTask, getTaskById, updateTask } from '../api/taskApi';
import { Task } from '../models/Task';
import { CurrentProjectService } from '../services/CurrentProjectService';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { notificationService } from '../services/NotificationService';

const TaskForm: React.FC = () => {
  const { storyId, taskId } = useParams<{ storyId: string, taskId?: string }>();
  const currentProject = CurrentProjectService.getCurrentProject();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task>({
    _id: '',
    name: '',
    description: '',
    priority: 'low',
    storyId: storyId || '',
    projectId: currentProject ? currentProject._id : '',
    estimatedTime: 0,
    status: 'todo',
    createdAt: new Date().toISOString(),
    startDate: '',
    endDate: '',
    userId: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProject || !storyId) {
      navigate('/projects');
      return;
    }
    if (taskId) {
      const fetchTask = async () => {
        try {
          const existingTask = await getTaskById(taskId);
          setTask(existingTask);
        } catch (err) {
          setError('Task not found');
        }
      };
      fetchTask();
    }
  }, [taskId, storyId, currentProject, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (taskId) {
        await updateTask(taskId, task);
        alert('Task updated successfully!');
        notificationService.send({
          title: 'Task updated successfully!',
          message: `Task ${task.name} updated successfully in story ${storyId} and project ${currentProject?.name}`,
          date: new Date().toISOString(),
          priority: 'medium',
          read: false
        });
      } else {
        await addTask(task);
        alert('Task added successfully!');
        setTask({
          _id: '',
          name: '',
          description: '',
          priority: 'low',
          storyId: storyId || '',
          projectId: currentProject ? currentProject._id : '',
          estimatedTime: 0,
          status: 'todo',
          createdAt: new Date().toISOString(),
          startDate: '',
          endDate: '',
          userId: ''
        });
        notificationService.send({
          title: 'New Task added!',
          message: `New task added in Story ${storyId} and project ${currentProject?.name}`,
          date: new Date().toISOString(),
          priority: 'medium',
          read: false
        });
      }
      navigate(`/tasks/${storyId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h1>{taskId ? 'Edit Task' : 'Add New Task'}</h1>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="formTaskName">
          <Form.Label>Nazwa zadania</Form.Label>
          <Form.Control
            type="text"
            value={task.name}
            onChange={e => setTask({ ...task, name: e.target.value })}
            placeholder="Nazwa zadania"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formTaskDescription">
          <Form.Label>Opis zadania</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={task.description}
            onChange={e => setTask({ ...task, description: e.target.value })}
            placeholder="Opis zadania"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formTaskPriority">
          <Form.Label>Priorytet</Form.Label>
          <Form.Control
            as="select"
            value={task.priority}
            onChange={e => setTask({ ...task, priority: e.target.value as 'low' | 'medium' | 'high' })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formTaskEstimatedTime">
          <Form.Label>Przewidywany czas (w godzinach)</Form.Label>
          <Form.Control
            type="number"
            value={task.estimatedTime}
            onChange={e => setTask({ ...task, estimatedTime: parseInt(e.target.value) })}
            placeholder="Przewidywany czas w godzinach"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formTaskStatus">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            value={task.status}
            onChange={e => setTask({ ...task, status: e.target.value as 'todo' | 'doing' | 'done' })}
          >
            <option value="todo">To do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          {taskId ? 'Zaktualizuj zadanie' : 'Dodaj zadanie'}
        </Button>
      </Form>
    </Container>
  );
};

export default TaskForm;
