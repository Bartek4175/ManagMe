import { Project } from "../models/Project";

export class CurrentProjectService {
    static localStorageKey = 'currentProject';

    static setCurrentProject(project: Project): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(project));
    }

    static getCurrentProject(): Project | null {
        const storedProject = localStorage.getItem(this.localStorageKey);
        return storedProject ? JSON.parse(storedProject) : null;
    }
}