import React, { useEffect, useState } from 'react';
import { TaskService } from '../services/TaskService';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { useParams } from 'react-router-dom';

const TaskDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [assignee, setAssignee] = useState<string>('');
    const [assignedUser, setAssignedUser] = useState<User | null>(null);

    useEffect(() => {
        if (id) {
            const existingTask = TaskService.getTaskById(id);
            if (existingTask) {
                setTask(existingTask);
                setAssignee(existingTask.userId || '');
            }
        }
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(data => {
                setUsers(data.filter((user: User) => user.role === 'devops' || user.role === 'developer'));
            })
            .catch(error => console.error('Error fetching users:', error));
    }, [id]);

    useEffect(() => {
        if (assignee) {
            fetch(`http://localhost:3000/users/${assignee}`)
                .then(response => response.json())
                .then(data => {
                    setAssignedUser(data);
                })
                .catch(error => console.error('Error fetching assigned user:', error));
        }
    }, [assignee]);

    const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = e.target.value;
        setAssignee(userId);
        if (task) {
            const updatedTask: Task = { ...task, userId, status: 'doing' as const, startDate: new Date().toISOString() };
            TaskService.updateTask(updatedTask);
            setTask(updatedTask);
        }
    };

    const markAsDone = () => {
        if (task) {
            const updatedTask: Task = { ...task, status: 'done' as const, endDate: new Date().toISOString() };
            TaskService.updateTask(updatedTask);
            setTask(updatedTask);
        }
    };

    if (!task) return <p>Loading...</p>;

    return (
        <div className="task-details">
            <h2>Szczegóły Zadania</h2>
            <p><strong>Nazwa:</strong> {task.name}</p>
            <p><strong>Opis:</strong> {task.description}</p>
            <p><strong>Priorytet:</strong> {task.priority}</p>
            <p><strong>Data dodania:</strong> {task.createdAt}</p>
            <p><strong>Przewidywany czas wykonania:</strong> {task.estimatedTime} godzin</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Data startu:</strong> {task.startDate}</p>
            <p><strong>Data zakończenia:</strong> {task.endDate}</p>
            <p><strong>Przypisana osoba:</strong> {assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName} (${assignedUser.role})` : 'Brak'}</p>
            {task.status === 'todo' && (
                <div>
                    <select value={assignee} onChange={handleAssigneeChange}>
                        <option value="">Wybierz osobę</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.firstName} {user.lastName} ({user.role})</option>
                        ))}
                    </select>
                </div>
            )}
            {task.status === 'doing' && (
                <button onClick={markAsDone}>Zakończ zadanie</button>
            )}
        </div>
    );
};

export default TaskDetails;
