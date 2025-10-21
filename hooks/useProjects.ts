import { useState, useEffect } from 'react';
import { projectsData } from '../data/projects';
import { Project } from '../components/ProjectCard';

const useProjects = (): Project[] => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    try {
      const localProjects = localStorage.getItem('sjk-studio-projects');
      if (localProjects && JSON.parse(localProjects).length > 0) {
        setProjects(JSON.parse(localProjects));
      } else {
        // If local storage is empty or invalid, initialize it with default data
        localStorage.setItem('sjk-studio-projects', JSON.stringify(projectsData));
        setProjects(projectsData);
      }
    } catch (error) {
      console.error("Failed to parse projects from localStorage, using default data.", error);
      setProjects(projectsData);
    }

    // This listener ensures that if projects are updated in another tab (e.g., the admin panel),
    // the current tab will reflect those changes.
    const handleStorageChange = () => {
        const updatedProjects = localStorage.getItem('sjk-studio-projects');
        if (updatedProjects) {
            setProjects(JSON.parse(updatedProjects));
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  return projects;
};

export default useProjects;