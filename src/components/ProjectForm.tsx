import React, { useState, useEffect } from 'react';
import { ProjectService } from '../services/ProjectService';
import { Project } from '../models/Project';
import { useParams } from 'react-router-dom';

const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

const ProjectForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project>({ id: '', name: '', description: '' });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const existingProject = ProjectService.getProjectById(id);
            if (existingProject) {
                setProject(existingProject);
            }
        }
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); 
        try {
            if (id) {
                ProjectService.updateProject(project);
                alert('Projekt zaktualizowany pomyślnie!');
            } else {
                const newProject = { ...project, id: generateId() };
                ProjectService.addProject(newProject);
                alert('Projekt dodany pomyślnie!');
                setProject({ id: '', name: '', description: '' });
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
                value={project.name}
                onChange={e => setProject({ ...project, name: e.target.value })}
                placeholder="Nazwa projektu"
                required
            />
            <textarea
                value={project.description}
                onChange={e => setProject({ ...project, description: e.target.value })}
                placeholder="Opis projektu"
                required
            />
            <button type="submit">{id ? 'Zaktualizuj Projekt' : 'Dodaj Projekt'}</button>
        </form>
    );
};

export default ProjectForm;
