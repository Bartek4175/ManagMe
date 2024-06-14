import React, { useEffect, useState } from 'react';
import { getTasksByStory, deleteTask } from '../api/taskApi';
import { Task } from '../models/Task';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const KanbanBoard: React.FC = () => {
    const { storyId } = useParams<{ storyId: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (storyId) {
            const fetchTasks = async () => {
                const storyTasks = await getTasksByStory(storyId);
                setTasks(storyTasks);
            };
            fetchTasks();
        }
    }, [storyId]);

    const handleDelete = async (id: string) => {
        await deleteTask(id);
        if (storyId) {
            setTasks(tasks.filter(task => task._id !== id));
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Tablica Kanban</h2>
            <div className="p-4 bg-white rounded shadow-sm">
                <Row>
                    {['todo', 'doing', 'done'].map(status => (
                        <Col key={status} className="kanban-column mb-4">
                            <h3 className="text-center">{status.toUpperCase()}</h3>
                            {tasks.filter(task => task.status === status).map(task => (
                                <Card key={task._id} className="kanban-card mb-3">
                                    <Card.Body>
                                        <Card.Title>{task.name}</Card.Title>
                                        <Card.Text>
                                            <strong>Opis:</strong> {task.description}<br />
                                            <strong>Priorytet:</strong> {task.priority}
                                        </Card.Text>
                                        <NavLink to={`/task/${task._id}`} className="btn btn-primary me-2">Szczegóły</NavLink>
                                        <Button variant="danger" onClick={() => handleDelete(task._id)}>Usuń</Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Col>
                    ))}
                </Row>
            </div>
        </Container>
    );
};

export default KanbanBoard;
