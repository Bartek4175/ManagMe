export interface Task {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    storyId: string;
    estimatedTime: number;
    status: 'todo' | 'doing' | 'done';
    createdAt: string;
    startDate?: string;
    endDate?: string;
    assigneeId?: string;
}
