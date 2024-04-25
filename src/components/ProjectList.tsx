import React, { useEffect, useState } from 'react';
import { ProjectService } from '../services/ProjectService';
import { Project } from '../models/Project';
import { Link } from 'react-router-dom';
import { CurrentProjectService } from '../services/CurrentProjectService';

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        setProjects(ProjectService.getProjects());
    }, []);

    const deleteProject = (id: string) => {
        ProjectService.deleteProject(id);
        setProjects(ProjectService.getProjects());
    };

    const selectProject = (project: Project) => {
        CurrentProjectService.setCurrentProject(project);
        alert(`Wybrano projekt: ${project.name}`);
    };

    return (
        <div>
            <h2>Lista Projektów</h2>
            {projects.map(project => (
                <div key={project.id}>
                    <p>ID: {project.id}, Nazwa: {project.name}, Opis: {project.description}</p>
                    <button onClick={() => deleteProject(project.id)}>Usuń</button>
                    <button onClick={() => selectProject(project)}>Wybierz</button>
                    <Link to={`/edit-project/${project.id}`}>Edytuj</Link>
                </div>
            ))}
        </div>
    );
};

export default ProjectList;
