import React, { useEffect, useState } from 'react';
import { ProjectService } from '../services/ProjectService';
import { Project } from '../models/Project';
import { Link } from 'react-router-dom';
import { CurrentProjectService } from '../services/CurrentProjectService';
import { Card, Button, Container } from 'react-bootstrap';

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        const fetchedProjects = ProjectService.getProjects();
        setProjects(fetchedProjects);
        const currentProject = CurrentProjectService.getCurrentProject();
        if (currentProject) {
            setSelectedProject(currentProject);
        }
    }, []);

    const deleteProject = (id: string) => {
        ProjectService.deleteProject(id);
        const updatedProjects = ProjectService.getProjects();
        setProjects(updatedProjects);
        if (selectedProject?.id === id) {
            setSelectedProject(null);
            CurrentProjectService.setCurrentProject(null);
        }
    };

    const selectProject = (project: Project) => {
        CurrentProjectService.setCurrentProject(project);
        setSelectedProject(project);
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
                            {selectedProject?.id === project.id ? (
                                <Button variant="danger">Wybrany</Button>
                            ) : (
                                <Button variant="primary" onClick={() => selectProject(project)}>Wybierz</Button>
                            )}
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
