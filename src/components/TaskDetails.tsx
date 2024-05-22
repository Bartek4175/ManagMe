import React, { useEffect, useState } from 'react';
import { TaskService } from '../services/TaskService';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Spinner } from 'react-bootstrap';

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

    const handleAssigneeChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
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

    if (!task) return <Spinner animation="border" />;

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header>
                    <h2>Szczegóły Zadania</h2>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col><strong>Nazwa:</strong></Col>
                        <Col>{task.name}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Opis:</strong></Col>
                        <Col>{task.description}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Priorytet:</strong></Col>
                        <Col>{task.priority}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Data dodania:</strong></Col>
                        <Col>{task.createdAt}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Przewidywany czas wykonania:</strong></Col>
                        <Col>{task.estimatedTime} godzin</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Status:</strong></Col>
                        <Col>{task.status}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Data startu:</strong></Col>
                        <Col>{task.startDate}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Data zakończenia:</strong></Col>
                        <Col>{task.endDate}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Przypisana osoba:</strong></Col>
                        <Col>{assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName} (${assignedUser.role})` : 'Brak'}</Col>
                    </Row>
                    {task.status === 'todo' && (
                        <div>
                            <label htmlFor="assigneeSelect">Przypisz do</label>
                            <select
                                id="assigneeSelect"
                                className="form-control"
                                value={assignee}
                                onChange={handleAssigneeChange}
                            >
                                <option value="">Wybierz osobę</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.firstName} {user.lastName} ({user.role})</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {task.status === 'doing' && (
                        <Button variant="success" onClick={markAsDone}>Zakończ zadanie</Button>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TaskDetails;
