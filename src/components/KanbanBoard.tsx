import React, { useEffect, useState } from 'react';
import { TaskService } from '../services/TaskService';
import { Task } from '../models/Task';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const KanbanBoard: React.FC = () => {
    const { storyId } = useParams<{ storyId: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (storyId) {
            const storyTasks = TaskService.getTasksByStory(storyId);
            setTasks(storyTasks);
        }
    }, [storyId]);

    const deleteTask = (id: string) => {
        TaskService.deleteTask(id);
        if (storyId) {
            setTasks(TaskService.getTasksByStory(storyId));
        }
    };

    return (
        <Container className="mt-4">
            <h2>Tablica Kanban</h2>
            <Row>
                {['todo', 'doing', 'done'].map(status => (
                    <Col key={status} className="kanban-column">
                        <h3>{status.toUpperCase()}</h3>
                        {tasks.filter(task => task.status === status).map(task => (
                            <Card key={task.id} className="kanban-card mb-3">
                                <Card.Body>
                                    <Card.Title>{task.name}</Card.Title>
                                    <Card.Text>
                                        <strong>Opis:</strong> {task.description}<br />
                                        <strong>Priorytet:</strong> {task.priority}
                                    </Card.Text>
                                    <NavLink to={`/task/${task.id}`} className="btn btn-primary me-2">Szczegóły</NavLink>
                                    <Button variant="danger" onClick={() => deleteTask(task.id)}>Usuń</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default KanbanBoard;
