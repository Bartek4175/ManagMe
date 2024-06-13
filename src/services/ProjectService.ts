import { Project } from "../models/Project";

export class ProjectService {
    static localStorageKey = 'projects';

    static getProjects(): Project[] {
        const storedProjects = localStorage.getItem(this.localStorageKey);
        return storedProjects ? JSON.parse(storedProjects) : [];
    }

    static getProjectById(id: string): Project | undefined {
        const projects = this.getProjects();
        return projects.find(project => project._id === id);
    }

    static addProject(project: Project): void {
        const projects = this.getProjects();
        if (projects.some(p => p._id === project._id)) {
            throw new Error(`Projekt z ID ${project._id} już istnieje.`);
        }
        projects.push(project);
        localStorage.setItem(this.localStorageKey, JSON.stringify(projects));
    }

    static updateProject(updatedProject: Project): void {
        const projects = this.getProjects();
        const projectIndex = projects.findIndex(project => project._id === updatedProject._id);
        if (projectIndex > -1) {
            projects[projectIndex] = updatedProject;
            localStorage.setItem(this.localStorageKey, JSON.stringify(projects));
        }
    }

    static deleteProject(id: string): void {
        const projects = this.getProjects();
        const filteredProjects = projects.filter(project => project._id !== id);
        localStorage.setItem(this.localStorageKey, JSON.stringify(filteredProjects));
    }
}
