import React, { useState, useEffect } from 'react';
import { StoryService } from '../services/StoryService';
import { Story } from '../models/Story';
import { useParams, useNavigate } from 'react-router-dom';
import { CurrentProjectService } from '../services/CurrentProjectService';
import { useAuth } from '../contexts/AuthContext';
import { Form, Button, Container } from 'react-bootstrap';
import { notificationService } from '../services/NotificationService';

const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

const StoryForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const currentProject = CurrentProjectService.getCurrentProject();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [story, setStory] = useState<Story>({
        id: '',
        name: '',
        description: '',
        priority: 'low',
        projectId: currentProject ? currentProject.id : '',
        createdAt: new Date().toISOString(),
        status: 'todo',
        ownerId: user ? user.id : ''
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !currentProject) {
            navigate('/projects');
            return;
        }
        if (id) {
            const existingStory = StoryService.getStoryById(id);
            if (existingStory) {
                setStory(existingStory);
            }
        }
    }, [id, user, currentProject, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!user) {
            setError('Użytkownik niezalogowany.');
            return;
        }
        try {
            if (id) {
                StoryService.updateStory({ ...story, ownerId: user.id });
                alert('Story zaktualizowany pomyślnie!');
                notificationService.send({
                    title: 'Story zaktualizowany pomyślnie',
                    message: `Story o ID ${id} został zaktualizowany`,
                    date: new Date().toISOString(),
                    priority: 'medium',
                    read: false
                });
            } else {
                const newStory = { ...story, id: generateId(), ownerId: user.id };
                StoryService.addStory(newStory);
                alert('Story dodana pomyślnie!');
                setStory({
                    id: '',
                    name: '',
                    description: '',
                    priority: 'low',
                    projectId: currentProject ? currentProject.id : '',
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
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Wystąpił nieznany błąd');
            }
        }
    };

    if (!currentProject) {
        return <p>Nie wybrano projektu. Przekierowanie...</p>;
    }

    return (
        <Container className="mt-4">
            <h2>{id ? 'Zaktualizuj Story' : 'Dodaj Story'}</h2>
            <Form onSubmit={handleSubmit}>
                {error && <p className="text-danger">{error}</p>}
                <Form.Group className="mb-3">
                    <Form.Label>Nazwa Story</Form.Label>
                    <Form.Control
                        type="text"
                        value={story.name}
                        onChange={e => setStory({ ...story, name: e.target.value })}
                        placeholder="Nazwa Story"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Opis Story</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={story.description}
                        onChange={e => setStory({ ...story, description: e.target.value })}
                        placeholder="Opis Story"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
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
                <Form.Group className="mb-3">
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
                <Button type="submit" variant="primary">
                    {id ? 'Zaktualizuj Story' : 'Dodaj Story'}
                </Button>
            </Form>
        </Container>
    );
};

export default StoryForm;
