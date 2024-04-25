import React, { useEffect, useState } from 'react';
import { StoryService } from '../services/StoryService';
import { Story } from '../models/Story';
import { CurrentProjectService } from '../services/CurrentProjectService';
import { Link } from 'react-router-dom';

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
            <h2>Lista Historyjek dla Projektu: {currentProject?.name}</h2>
            {['todo', 'doing', 'done'].map(status => (
                <div key={status}>
                    <h3>{status.toUpperCase()}</h3>
                    {stories.filter(story => story.status === status).map(story => (
                        <div key={story.id}>
                            <p>ID: {story.id}, Nazwa: {story.name}, Opis: {story.description}, Priorytet: {story.priority}</p>
                            <button onClick={() => deleteStory(story.id)}>Usuń</button>
                            <Link to={`/edit-story/${story.id}`}><button>Edytuj</button></Link>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default StoryList;
