export interface Story {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    projectId: string;
    createdAt: string;
    status: 'todo' | 'doing' | 'done';
    ownerId: string;
}