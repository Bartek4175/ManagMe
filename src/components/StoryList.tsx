import React, { useEffect, useState } from 'react';
import { getStoriesByProject, deleteStory } from '../api/storyApi';
import { Story } from '../models/Story';
import { useNavigate } from 'react-router-dom';
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

        const fetchStories = async () => {
            try {
                const fetchedStories = await getStoriesByProject(currentProject._id);
                setStories(fetchedStories);
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        };

        fetchStories();
    }, [currentProject, navigate]);

    const handleDelete = async (id: string) => {
        try {
            await deleteStory(id);
            setStories(stories.filter(story => story._id !== id));
        } catch (error) {
            console.error('Error deleting story:', error);
        }
    };
    const handleEdit = (id: string) => {
        navigate(`/edit-story/${id}`);
    };
    const handleAddTask = (storyId: string) => {
        navigate(`/add-task/${storyId}`);
    };

    const handleViewTasks = (storyId: string) => {
        navigate(`/tasks/${storyId}`);
    };
    if (!currentProject) {
        return <p>Nie wybrano projektu.</p>;
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Lista Story</h2>
            <div className="p-4 bg-white rounded shadow-sm">
                <Row className="kanban-board">
                    {['todo', 'doing', 'done'].map(status => (
                        <Col key={status} className="kanban-column mb-4">
                            <h3 className="text-center">{status.toUpperCase()}</h3>
                            {stories.filter(story => story.status === status).map(story => (
                                <Card key={story._id} className="kanban-card mb-3">
                                    <Card.Body>
                                        <Card.Title>ID: {story._id}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">Nazwa: {story.name}</Card.Subtitle>
                                        <Card.Text>Opis: {story.description}</Card.Text>
                                        <div className="story-actions d-flex flex-column">
                                            <Button variant="danger" onClick={() => handleDelete(story._id)} className="mb-2">Usuń</Button>
                                            <Button variant="primary" className="mb-2" onClick={() => handleEdit(story._id)}>Edytuj</Button>
                                            <Button variant="secondary" className="mb-2" onClick={() => handleAddTask(story._id)}>Dodaj Zadanie</Button>
                                            <Button variant="info" onClick={() => handleViewTasks(story._id)}>Zobacz Zadania</Button>
                                        </div>
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

export default StoryList;
