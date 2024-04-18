import React, { useState } from 'react';
import { ProjectService } from '../services/ProjectService';
import { Project } from '../models/Project';

const ProjectForm: React.FC = () => {
    const [project, setProject] = useState<Project>({ id: '', name: '', description: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        ProjectService.addProject(project);
        setProject({ id: '', name: '', description: '' });  // Reset form
        alert('Projekt dodany pomyślnie!');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={project.id}
                onChange={e => setProject({ ...project, id: e.target.value })}
                placeholder="ID projektu"
                required
            />
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
            <button type="submit">Dodaj Projekt</button>
        </form>
    );
};

export default ProjectForm;
