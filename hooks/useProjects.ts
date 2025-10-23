import { useState, useEffect } from 'react';
import { Project } from '../components/ProjectCard';
import { projectsData } from '../data/projects'; // Import the local data

const useProjects = (): Project[] => {
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://sjkstudio.vercel.app/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data: Project[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects from API:", error);
        // --- FALLBACK LOGIC ---
        // If the API fails, load the local data so the site doesn't look broken.
        console.log("API fetch failed. Falling back to local project data.");
        setProjects(projectsData);
      }
    };
    
    fetchProjects();
  }, []);

  return projects;
};

export default useProjects;