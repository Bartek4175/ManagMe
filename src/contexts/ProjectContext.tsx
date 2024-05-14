import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface ProjectContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  clearCurrentProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(() => {
    const storedProject = localStorage.getItem('currentProject');
    return storedProject ? JSON.parse(storedProject) : null;
  });

  const setCurrentProject = (project: Project) => {
    localStorage.setItem('currentProject', JSON.stringify(project));
    setCurrentProjectState(project);
  };

  const clearCurrentProject = () => {
    localStorage.removeItem('currentProject');
    setCurrentProjectState(null);
  };

  return (
    <ProjectContext.Provider value={{ currentProject, setCurrentProject, clearCurrentProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
