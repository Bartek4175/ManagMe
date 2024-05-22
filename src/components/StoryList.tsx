import React, { useEffect, useState } from 'react';
import { StoryService } from '../services/StoryService';
import { Story } from '../models/Story';
import { Link, useNavigate } from 'react-router-dom';
import { CurrentProjectService } from '../services/CurrentProjectService';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const StoryList: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const currentProject = CurrentProjectService.getCurrentProject();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentProject) {
            navigate('/projects');
            return;
        }

        const fetchedStories = StoryService.getStoriesByProject(currentProject.id);
        if (JSON.stringify(stories) !== JSON.stringify(fetchedStories)) {
            setStories(fetchedStories);
        }

    }, [currentProject, navigate, stories]);

    const deleteStory = (id: string) => {
        StoryService.deleteStory(id);
        if (currentProject) {
            const updatedStories = StoryService.getStoriesByProject(currentProject.id);
            setStories(updatedStories);
        }
    };

    if (!currentProject) {
        return <p>Nie wybrano projektu. Przekierowanie...</p>;
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Lista Historyjek</h2>
            <Row className="kanban-board">
                {['todo', 'doing', 'done'].map(status => (
                    <Col key={status} className="kanban-column">
                        <h3 className="text-center">{status.toUpperCase()}</h3>
                        {stories.filter(story => story.status === status).map(story => (
                            <Card key={story.id} className="kanban-card mb-3">
                                <Card.Body>
                                    <Card.Title>ID: {story.id}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Nazwa: {story.name}</Card.Subtitle>
                                    <Card.Text>Opis: {story.description}</Card.Text>
                                    <div className="story-actions">
                                        <Button variant="danger" onClick={() => deleteStory(story.id)} className="me-2">Usuń</Button>
                                        <Button variant="primary" className="me-2">
                                            <Link to={`/edit-story/${story.id}`} className="text-white text-decoration-none">Edytuj</Link>
                                        </Button>
                                        <Button variant="secondary" className="me-2">
                                            <Link to={`/add-task/${story.id}`} className="text-white text-decoration-none">Dodaj Zadanie</Link>
                                        </Button>
                                        <Button variant="info">
                                            <Link to={`/tasks/${story.id}`} className="text-white text-decoration-none">Zobacz Zadania</Link>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default StoryList;
