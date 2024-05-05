import React, { useEffect, useState } from 'react';
import { TaskService } from '../services/TaskService';
import { Task } from '../models/Task';
import { Link, useParams } from 'react-router-dom';

const KanbanBoard: React.FC = () => {
    const { storyId } = useParams<{ storyId: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (storyId) {
            const storyTasks = TaskService.getTasksByStory(storyId);
            setTasks(storyTasks);
        }
    }, [storyId]);

    const deleteTask = (id: string) => {
        TaskService.deleteTask(id);
        if (storyId) {
            setTasks(TaskService.getTasksByStory(storyId));
        }
    };

    return (
        <div>
            <h2>Tablica Kanban</h2>
            <div className="kanban-board">
                {['todo', 'doing', 'done'].map(status => (
                    <div key={status} className="kanban-column">
                        <h3>{status.toUpperCase()}</h3>
                        {tasks.filter(task => task.status === status).map(task => (
                            <div key={task.id} className="kanban-card">
                                <p>Nazwa: {task.name}</p>
                                <p>Opis: {task.description}</p>
                                <p>Priorytet: {task.priority}</p>
                                <Link to={`/task/${task.id}`}>Szczegóły</Link>
                                <button onClick={() => deleteTask(task.id)}>Usuń</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;
