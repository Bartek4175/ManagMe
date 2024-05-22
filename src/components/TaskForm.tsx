import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskService } from '../services/TaskService';
import { Task } from '../models/Task';
import { CurrentProjectService } from '../services/CurrentProjectService';
import { Form, Button, Container } from 'react-bootstrap';

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const TaskForm: React.FC = () => {
  const { storyId, taskId } = useParams<{ storyId: string, taskId?: string }>();
  const currentProject = CurrentProjectService.getCurrentProject();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task>({
    id: '',
    name: '',
    description: '',
    priority: 'low',
    storyId: storyId || '',
    projectId: currentProject ? currentProject.id : '',
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
      const existingTask = TaskService.getTaskById(taskId);
      if (existingTask) {
        setTask(existingTask);
      }
    }
  }, [taskId, storyId, currentProject, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (taskId) {
        TaskService.updateTask(task);
        alert('Zadanie zaktualizowane pomyślnie!');
      } else {
        const newTask = { ...task, id: generateId() };
        TaskService.addTask(newTask);
        alert('Zadanie dodane pomyślnie!');
        setTask({
          id: '',
          name: '',
          description: '',
          priority: 'low',
          storyId: storyId || '',
          projectId: currentProject ? currentProject.id : '',
          estimatedTime: 0,
          status: 'todo',
          createdAt: new Date().toISOString(),
          startDate: '',
          endDate: '',
          userId: ''
        });
      }
      navigate(`/tasks/${storyId}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Wystąpił nieznany błąd');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h1>{taskId ? 'Edytuj Zadanie' : 'Dodaj Nowe Zadanie'}</h1>
      <Form onSubmit={handleSubmit}>
        {error && <p className="text-danger">{error}</p>}
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
            <option value="low">Niski</option>
            <option value="medium">Średni</option>
            <option value="high">Wysoki</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formTaskEstimatedTime">
          <Form.Label>Szacowany czas wykonania</Form.Label>
          <Form.Control
            type="number"
            value={task.estimatedTime}
            onChange={e => setTask({ ...task, estimatedTime: parseInt(e.target.value) })}
            placeholder="Szacowany czas wykonania"
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
            <option value="todo">Do zrobienia</option>
            <option value="doing">W trakcie</option>
            <option value="done">Zakończone</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          {taskId ? 'Zaktualizuj Zadanie' : 'Dodaj Zadanie'}
        </Button>
      </Form>
    </Container>
  );
};

export default TaskForm;
