import { Task } from '../models/Task';

export class TaskService {
    static localStorageKey = 'tasks';

    static getTasksByStory(storyId: string): Task[] {
        const storedTasks = localStorage.getItem(this.localStorageKey);
        const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
        return tasks.filter(task => task.storyId === storyId);
    }

    static getTaskById(id: string): Task | undefined {
        const tasks = this.getTasks();
        return tasks.find(task => task.id === id);
    }

    static addTask(task: Task): void {
        const tasks = this.getTasks();
        tasks.push(task);
        localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
    }

    static updateTask(updatedTask: Task): void {
        const tasks = this.getTasks();
        const taskIndex = tasks.findIndex(task => task.id === updatedTask.id);
        if (taskIndex > -1) {
            tasks[taskIndex] = updatedTask;
            localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
        }
    }

    static deleteTask(id: string): void {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem(this.localStorageKey, JSON.stringify(filteredTasks));
    }

    private static getTasks(): Task[] {
        const storedTasks = localStorage.getItem(this.localStorageKey);
        return storedTasks ? JSON.parse(storedTasks) : [];
    }
}