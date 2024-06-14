import { Project } from '../models/Project';

export class CurrentProjectService {
    private static localStorageKey = 'currentProject';

    static setCurrentProject(project: Project | null): void {
        if (project === null) {
            localStorage.removeItem(this.localStorageKey);
        } else {
            localStorage.setItem(this.localStorageKey, JSON.stringify(project));
            window.dispatchEvent(new Event('currentProjectChanged'));
        }
    }

    static getCurrentProject(): Project | null {
        const project = localStorage.getItem(this.localStorageKey);
        return project ? JSON.parse(project) : null;
    }

    static clearCurrentProject(): void {
        localStorage.removeItem(this.localStorageKey);
        window.dispatchEvent(new Event('currentProjectChanged'));
    }
}
