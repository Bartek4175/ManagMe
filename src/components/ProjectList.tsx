import React, { useEffect, useState } from 'react';
import { getProjects, deleteProject } from '../api/projectApi';
import { Project } from '../models/Project';
import { Link } from 'react-router-dom';
import { Card, Button, Container } from 'react-bootstrap';
import { CurrentProjectService } from '../services/CurrentProjectService';

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const fetchedProjects = await getProjects();
            setProjects(fetchedProjects);

            // Check if there's a selected project in local storage and set it
            const currentProject = CurrentProjectService.getCurrentProject();
            if (currentProject) {
                setSelectedProject(currentProject);
            }
        };
        fetchProjects();
    }, []);

    const handleDelete = async (_id: string) => {
        await deleteProject(_id);
        setProjects(projects.filter(project => project._id !== _id));
        if (selectedProject?._id === _id) {
            setSelectedProject(null);
            CurrentProjectService.clearCurrentProject();
        }
    };

    const selectProject = (project: Project) => {
        setSelectedProject(project);
        CurrentProjectService.setCurrentProject(project);
        alert(`Wybrano projekt: ${project.name}`);
    };

    return (
        <Container className="mt-4">
            <h2>Lista Projektów</h2>
            {projects.length === 0 ? (
                <p>Brak projektów</p>
            ) : (
                projects.map(project => (
                    <Card key={project._id} className="mb-3">
                        <Card.Body>
                            <Card.Title>{project.name}</Card.Title>
                            <Card.Text>
                                <strong>ID:</strong> {project._id}<br />
                                <strong>Opis:</strong> {project.description}
                            </Card.Text>
                            <div className="d-flex justify-content-between">
                                {selectedProject?._id === project._id ? (
                                    <Button variant="danger">Wybrany</Button>
                                ) : (
                                    <Button variant="primary" onClick={() => selectProject(project)}>Wybierz</Button>
                                )}
                                <Button variant="danger" onClick={() => handleDelete(project._id)}>Usuń</Button>
                                <Link to={`/edit-project/${project._id}`} className="btn btn-secondary">Edytuj</Link>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default ProjectList;
