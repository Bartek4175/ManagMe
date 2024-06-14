import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addStory, getStoryById, updateStory } from '../api/storyApi';
import { Story } from '../models/Story';
import { CurrentProjectService } from '../services/CurrentProjectService';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { notificationService } from '../services/NotificationService';
import { useAuth } from '../contexts/useAuth';

const StoryForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const currentProject = CurrentProjectService.getCurrentProject();
    const { user } = useAuth();
    const navigate = useNavigate();
    //console.log(user);
    const [story, setStory] = useState<Story>({
        _id: '',
        name: '',
        description: '',
        priority: 'low',
        projectId: currentProject ? currentProject._id : '',
        createdAt: new Date().toISOString(),
        status: 'todo',
        ownerId: user ? user.id : ''
    });
    const [error, setError] = useState<string | null>(null);

    const fetchStory = useCallback(async () => {
        if (id) {
            try {
                const existingStory = await getStoryById(id);
                if (existingStory && existingStory._id !== story._id) {
                    setStory(existingStory);
                }
            } catch (err) {
                setError('Story not found');
            }
        }
    }, [id, story._id]);

    useEffect(() => {
        if (!user || !currentProject) {
            navigate('/projects');
            return;
        }
        fetchStory();
    }, [user, currentProject, fetchStory, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!user) {
            setError('Użytkownik niezalogowany.');
            return;
        }
        try {
            if (id) {
                await updateStory(id, { ...story, ownerId: user.id });
                notificationService.send({
                    title: 'Story zaktualizowany pomyślnie',
                    message: `Story o ID ${id} został zaktualizowany`,
                    date: new Date().toISOString(),
                    priority: 'medium',
                    read: false
                });
            } else {
                await addStory({ ...story, ownerId: user.id });
                setStory({
                    _id: '',
                    name: '',
                    description: '',
                    priority: 'low',
                    projectId: currentProject ? currentProject._id : '',
                    createdAt: new Date().toISOString(),
                    status: 'todo',
                    ownerId: user.id
                });
                notificationService.send({
                    title: 'Story dodana pomyślnie!',
                    message: `Nowe story w projekcie ${currentProject?.name} zostało dodane! `,
                    date: new Date().toISOString(),
                    priority: 'medium',
                    read: false
                });
            }
            navigate('/stories');
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
            <h2>{id ? 'Zaktualizuj Story' : 'Dodaj Story'}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formStoryName">
                    <Form.Label>Nazwa Story</Form.Label>
                    <Form.Control
                        type="text"
                        value={story.name}
                        onChange={e => setStory({ ...story, name: e.target.value })}
                        placeholder="Nazwa Story"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStoryDescription">
                    <Form.Label>Opis Story</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={story.description}
                        onChange={e => setStory({ ...story, description: e.target.value })}
                        placeholder="Opis Story"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStoryPriority">
                    <Form.Label>Priorytet</Form.Label>
                    <Form.Control
                        as="select"
                        value={story.priority}
                        onChange={e => setStory({ ...story, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    >
                        <option value="low">Niski</option>
                        <option value="medium">Średni</option>
                        <option value="high">Wysoki</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStoryStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                        as="select"
                        value={story.status}
                        onChange={e => setStory({ ...story, status: e.target.value as 'todo' | 'doing' | 'done' })}
                    >
                        <option value="todo">Do zrobienia</option>
                        <option value="doing">W trakcie</option>
                        <option value="done">Zakończone</option>
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">
                    {id ? 'Zaktualizuj Story' : 'Dodaj Story'}
                </Button>
            </Form>
        </Container>
    );
};

export default StoryForm;
