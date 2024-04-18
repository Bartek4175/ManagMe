import React, { useEffect, useState } from 'react';
import { ProjectService } from '../services/ProjectService';
import { Project } from '../models/Project';

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        setProjects(ProjectService.getProjects());
    }, []);

    return (
        <div>
            <h2>Lista Projektów</h2>
            {projects.map(project => (
                <div key={project.id}>
                    <p>ID: {project.id}, Nazwa: {project.name}, Opis: {project.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ProjectList;
