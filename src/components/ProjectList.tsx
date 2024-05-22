import React, { useEffect, useState } from 'react';
import { ProjectService } from '../services/ProjectService';
import { Project } from '../models/Project';
import { Link } from 'react-router-dom';
import { CurrentProjectService } from '../services/CurrentProjectService';
import { Card, Button, Container } from 'react-bootstrap';

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
        <Container className="mt-4">
            <h2>Lista Projektów</h2>
            {projects.map(project => (
                <Card key={project.id} className="mb-3">
                    <Card.Body>
                        <Card.Title>{project.name}</Card.Title>
                        <Card.Text>
                            <strong>ID:</strong> {project.id}<br />
                            <strong>Opis:</strong> {project.description}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                            <Button variant="primary" onClick={() => selectProject(project)}>Wybierz</Button>
                            <Button variant="danger" onClick={() => deleteProject(project.id)}>Usuń</Button>
                            <Link to={`/edit-project/${project.id}`} className="btn btn-secondary">Edytuj</Link>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default ProjectList;
