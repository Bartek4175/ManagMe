import React, { useState, useEffect } from 'react';
import { StoryService } from '../services/StoryService';
import { Story } from '../models/Story';
import { useParams } from 'react-router-dom';
import { CurrentProjectService } from '../services/CurrentProjectService';
import { UserService } from '../services/UserService';

const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

const StoryForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const currentProject = CurrentProjectService.getCurrentProject();
    const currentUser = UserService.getCurrentUser();
    const [story, setStory] = useState<Story>({
        id: '',
        name: '',
        description: '',
        priority: 'low',
        projectId: currentProject ? currentProject.id : '',
        createdAt: new Date().toISOString(),
        status: 'todo',
        ownerId: currentUser.id
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const existingStory = StoryService.getStoryById(id);
            if (existingStory) {
                setStory(existingStory);
            }
        }
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); 
        try {
            if (id) {
                StoryService.updateStory(story);
                alert('Historyjka zaktualizowana pomyślnie!');
            } else {
                const newStory = { ...story, id: generateId() };
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
                    ownerId: currentUser.id
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
