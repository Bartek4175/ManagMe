export interface Task {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    storyId: string;
    projectId: string;
    estimatedTime: number;
    status: 'todo' | 'doing' | 'done';
    createdAt: string;
    startDate: string;
    endDate: string;
    userId: string;
    assigneeId?: string;
}
