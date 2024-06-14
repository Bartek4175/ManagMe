import React, { useEffect, useState } from 'react';
import { getTaskById, updateTask } from '../api/taskApi';
import { getUsers, getUserById } from '../api/userApi';
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
            const fetchTask = async () => {
                const existingTask = await getTaskById(id);
                if (existingTask) {
                    setTask(existingTask);
                    setAssignee(existingTask.userId || '');
                }
            };
            fetchTask();
        }
        
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data.filter(user => user.role === 'devops' || user.role === 'developer'));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [id]);

    useEffect(() => {
        if (assignee) {
            const fetchAssignedUser = async () => {
                try {
                    const data = await getUserById(assignee);
                    setAssignedUser(data);
                } catch (error) {
                    console.error('Error fetching assigned user:', error);
                }
            };
            fetchAssignedUser();
        }
    }, [assignee]);

    const handleAssigneeChange: React.ChangeEventHandler<HTMLSelectElement> = async (e) => {
        const userId = e.target.value;
        setAssignee(userId);
        if (task) {
            const updatedTask: Task = { ...task, userId, status: 'doing' as const, startDate: new Date().toISOString() };
            await updateTask(task._id, updatedTask);
            setTask(updatedTask);
        }
    };

    const markAsDone = async () => {
        if (task) {
            const updatedTask: Task = { ...task, status: 'done' as const, endDate: new Date().toISOString() };
            await updateTask(task._id, updatedTask);
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
                                    <option key={user._id} value={user._id}>{user.firstName} {user.lastName} ({user.role})</option>
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
