import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Project } from '../models/Project';
import { addProject, getProjectById, updateProject } from '../api/projectApi';
import { notificationService } from '../services/NotificationService';

const ProjectForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project>({ _id: '', name: '', description: '' });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchProject = async () => {
                try {
                    const existingProject = await getProjectById(id);
                    if (existingProject) {
                        setProject(existingProject);
                    } else {
                        setError('Project not found');
                    }
                } catch (err) {
                    setError('Project not found');
                }
            };
            fetchProject();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (id) {
                const updatedProject = await updateProject(id, project);
                alert('Project updated successfully!');
                notificationService.send({
                    title: 'Project Updated',
                    message: `Project ${updatedProject.name} has been updated`,
                    date: new Date().toISOString(),
                    priority: 'medium',
                    read: false
                });
            } else {
                const newProject = await addProject(project);
                alert('Project added successfully!');
                setProject({ _id: '', name: '', description: '' });
                notificationService.send({
                    title: 'New Project Added',
                    message: `Project ${newProject.name} has been added`,
                    date: new Date().toISOString(),
                    priority: 'medium',
                    read: false
                });
            }
            navigate('/projects');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <Container className="mt-4">
            <h2>{id ? 'Edit Project' : 'Add Project'}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="projectName" className="mb-3">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={project.name}
                        onChange={e => setProject({ ...project, name: e.target.value })}
                        placeholder="Project Name"
                        required
                    />
                </Form.Group>
                <Form.Group controlId="projectDescription" className="mb-3">
                    <Form.Label>Project Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={project.description}
                        onChange={e => setProject({ ...project, description: e.target.value })}
                        placeholder="Project Description"
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {id ? 'Update Project' : 'Add Project'}
                </Button>
            </Form>
        </Container>
    );
};

export default ProjectForm;
