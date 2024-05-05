import React, { useState, useEffect } from 'react';
import { TaskService } from '../services/TaskService';
import { Task } from '../models/Task';
import { useParams } from 'react-router-dom';

const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

const TaskForm: React.FC = () => {
    const { storyId, taskId } = useParams<{ storyId: string; taskId: string }>();
    const [task, setTask] = useState<Task>({
        id: '',
        name: '',
        description: '',
        priority: 'low',
        storyId: storyId || '',
        estimatedTime: 0,
        status: 'todo',
        createdAt: new Date().toISOString()
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (taskId) {
            const existingTask = TaskService.getTaskById(taskId);
            if (existingTask) {
                setTask(existingTask);
            }
        }
    }, [taskId]);

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
                    estimatedTime: 0,
                    status: 'todo',
                    createdAt: new Date().toISOString()
                });
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Wystąpił nieznany błąd');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                value={task.name}
                onChange={e => setTask({ ...task, name: e.target.value })}
                placeholder="Nazwa zadania"
                required
            />
            <textarea
                value={task.description}
                onChange={e => setTask({ ...task, description: e.target.value })}
                placeholder="Opis zadania"
                required
            />
            <select
                value={task.priority}
                onChange={e => setTask({ ...task, priority: e.target.value as 'low' | 'medium' | 'high' })}
            >
                <option value="low">Niski</option>
                <option value="medium">Średni</option>
                <option value="high">Wysoki</option>
            </select>
            <input
                type="number"
                value={task.estimatedTime}
                onChange={e => setTask({ ...task, estimatedTime: parseInt(e.target.value, 10) })}
                placeholder="Przewidywany czas wykonania (godziny)"
                required
            />
            <button type="submit">{taskId ? 'Zaktualizuj Zadanie' : 'Dodaj Zadanie'}</button>
        </form>
    );
};

export default TaskForm;