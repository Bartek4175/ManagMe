import { Project } from '../models/Project';

export class CurrentProjectService {
    private static localStorageKey = 'currentProject';

    static setCurrentProject(project: Project): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(project));
    }

    static getCurrentProject(): Project | null {
        const project = localStorage.getItem(this.localStorageKey);
        return project ? JSON.parse(project) : null;
    }
}
