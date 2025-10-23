import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/config';
import { Project } from '../data/projects';

export interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, 'id'>) => Promise<any>;
  updateProject: (id: string, project: Partial<Omit<Project, 'id'>>) => Promise<any>;
  deleteProject: (id: string) => Promise<any>;
}

const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching projects from Supabase:", error);
      setError(error.message);
      setProjects([]);
    } else {
      // Map Supabase data to our Project type
      const formattedProjects: Project[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageURL: item.imageURL,
      }));
      setProjects(formattedProjects);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();

    const channel = supabase
      .channel('realtime projects')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          console.log('Change received!', payload);
          // Refetch all projects to ensure data consistency
          fetchProjects();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProjects]);

  const addProject = async (project: Omit<Project, 'id'>) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select();
    if (error) throw error;
    return data;
  };

  const updateProject = async (id: string, project: Partial<Omit<Project, 'id'>>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  };

  const deleteProject = async (id: string) => {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return data;
  };

  return { projects, isLoading, error, addProject, updateProject, deleteProject };
};

export default useProjects;
