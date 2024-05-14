import React, { useState, useEffect } from 'react';
import { StoryService } from '../services/StoryService';
import { Story } from '../models/Story';
import { useParams, useNavigate } from 'react-router-dom';
import { CurrentProjectService } from '../services/CurrentProjectService';
import { useAuth } from '../contexts/AuthContext';

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
                alert('Historyjka zaktualizowana pomyślnie!');
            } else {
                const newStory = { ...story, id: generateId(), ownerId: user.id };
                StoryService.addStory(newStory);
                alert('Historyjka dodana pomyślnie!');
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
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                value={story.name}
                onChange={e => setStory({ ...story, name: e.target.value })}
                placeholder="Nazwa historyjki"
                required
            />
            <textarea
                value={story.description}
                onChange={e => setStory({ ...story, description: e.target.value })}
                placeholder="Opis historyjki"
                required
            />
            <select
                value={story.priority}
                onChange={e => setStory({ ...story, priority: e.target.value as 'low' | 'medium' | 'high' })}
            >
                <option value="low">Niski</option>
                <option value="medium">Średni</option>
                <option value="high">Wysoki</option>
            </select>
            <select
                value={story.status}
                onChange={e => setStory({ ...story, status: e.target.value as 'todo' | 'doing' | 'done' })}
            >
                <option value="todo">Do zrobienia</option>
                <option value="doing">W trakcie</option>
                <option value="done">Zakończone</option>
            </select>
            <button type="submit">{id ? 'Zaktualizuj Historyjkę' : 'Dodaj Historyjkę'}</button>
        </form>
    );
};

export default StoryForm;
