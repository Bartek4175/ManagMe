import React, { useState, useEffect } from 'react';
import { ProjectService } from '../services/ProjectService';
import { Project } from '../models/Project';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

const ProjectForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
                window.dispatchEvent(new Event('projectUpdated'));
            } else {
                const newProject = { ...project, id: generateId() };
                ProjectService.addProject(newProject);
                alert('Projekt dodany pomyślnie!');
                setProject({ id: '', name: '', description: '' });
            }
            navigate('/projects');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Wystąpił nieznany błąd');
            }
        }
    };

    return (
        <Container className="mt-4">
            <h2>{id ? 'Edytuj Projekt' : 'Dodaj Projekt'}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="projectName" className="mb-3">
                    <Form.Label>Nazwa projektu</Form.Label>
                    <Form.Control
                        type="text"
                        value={project.name}
                        onChange={e => setProject({ ...project, name: e.target.value })}
                        placeholder="Nazwa projektu"
                        required
                    />
                </Form.Group>
                <Form.Group controlId="projectDescription" className="mb-3">
                    <Form.Label>Opis projektu</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={project.description}
                        onChange={e => setProject({ ...project, description: e.target.value })}
                        placeholder="Opis projektu"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {id ? 'Zaktualizuj Projekt' : 'Dodaj Projekt'}
                </Button>
            </Form>
        </Container>
    );
};

export default ProjectForm;
