import { Story } from "../models/Story";

export class StoryService {
    static localStorageKey = 'stories';

    static getStoriesByProject(projectId: string): Story[] {
        const storedStories = localStorage.getItem(this.localStorageKey);
        const stories: Story[] = storedStories ? JSON.parse(storedStories) : [];
        return stories.filter(story => story.projectId === projectId);
    }

    static getStoryById(id: string): Story | undefined {
        const stories = this.getStories();
        return stories.find(story => story.id === id);
    }

    static addStory(story: Story): void {
        const stories = this.getStories();
        stories.push(story);
        localStorage.setItem(this.localStorageKey, JSON.stringify(stories));
    }

    static updateStory(updatedStory: Story): void {
        const stories = this.getStories();
        const storyIndex = stories.findIndex(story => story.id === updatedStory.id);
        if (storyIndex > -1) {
            stories[storyIndex] = updatedStory;
            localStorage.setItem(this.localStorageKey, JSON.stringify(stories));
        }
    }

    static deleteStory(id: string): void {
        const stories = this.getStories();
        const filteredStories = stories.filter(story => story.id !== id);
        localStorage.setItem(this.localStorageKey, JSON.stringify(filteredStories));
    }

    static getStories(): Story[] { 
        const storedStories = localStorage.getItem(this.localStorageKey);
        return storedStories ? JSON.parse(storedStories) : [];
    }
}
