import React, { useEffect, useState } from 'react';
import { StoryService } from '../services/StoryService';
import { Story } from '../models/Story';
import { Link } from 'react-router-dom';
import { CurrentProjectService } from '../services/CurrentProjectService';

const StoryList: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const currentProject = CurrentProjectService.getCurrentProject();

    useEffect(() => {
        if (currentProject) {
            setStories(StoryService.getStoriesByProject(currentProject.id));
        }
    }, [currentProject]);

    const deleteStory = (id: string) => {
        StoryService.deleteStory(id);
        if (currentProject) {
            setStories(StoryService.getStoriesByProject(currentProject.id));
        }
    };

    return (
        <div>
            <h2>Lista Historyjek</h2>
            <div className="kanban-board">
                {['todo', 'doing', 'done'].map(status => (
                    <div key={status} className="kanban-column">
                        <h3>{status.toUpperCase()}</h3>
                        {stories.filter(story => story.status === status).map(story => (
                            <div key={story.id} className="kanban-card">
                                <p><strong>ID:</strong> {story.id}</p>
                                <p><strong>Nazwa:</strong> {story.name}</p>
                                <p><strong>Opis:</strong> {story.description}</p>
                                <div className="story-actions">
                                    <button onClick={() => deleteStory(story.id)}>Usuń</button>
                                    <Link to={`/edit-story/${story.id}`}>Edytuj</Link>
                                    <Link to={`/add-task/${story.id}`}>Dodaj Zadanie</Link>
                                    <Link to={`/tasks/${story.id}`}>Zobacz Zadania</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryList;