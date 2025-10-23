import React, { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase/config';
import { Project } from '../data/projects';
import useProjects from '../hooks/useProjects';

type CurrentProjectState = {
    id?: string;
    title: string;
    description: string;
    imageURL: string;
    liveUrl?: string;
};

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden="true" height="24" viewBox="0 0 16 16" version="1.1" width="24" fill="currentColor" {...props}>
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.19.01-.82.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21-.15.46-.55.38A8.013 8.013 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
    </svg>
);

const Admin: React.FC = () => {
    const [user, setUser] = useState<any | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [loginError, setLoginError] = useState<string>('');
    
    const { projects, addProject, updateProject, deleteProject, isLoading: projectsLoading, error: projectsError } = useProjects();
    const [saveMessage, setSaveMessage] = useState<string>('');
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const emptyProject: CurrentProjectState = {
        title: '',
        description: '',
        imageURL: '',
        liveUrl: '',
    };

    const [currentProject, setCurrentProject] = useState<CurrentProjectState>(emptyProject);
    
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setAuthLoading(false);
        });
    
        return () => subscription.unsubscribe();
    }, []);
    
    const handleGitHubLogin = async () => {
        setLoginError('');
        // Construct the redirectTo URL to point specifically to the admin page.
        // This ensures that after a successful login, the user is returned here.
        const redirectTo = `${window.location.origin}${window.location.pathname}#/admin`;
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo,
            },
        });
        if (error) {
            console.error('GitHub login error:', error.message);
            setLoginError('GitHub login failed. Please try again.');
        }
    };
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentProject(prev => ({ ...prev, [name]: value }));
    };
    
    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setCurrentProject({ 
            id: project.id,
            title: project.title,
            description: project.description,
            imageURL: project.imageURL,
            liveUrl: project.liveUrl || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleCancelEdit = () => {
        setEditingProject(null);
        setCurrentProject(emptyProject);
    };

    const handleProjectSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaveMessage('Saving...');
        
        const projectData = {
            title: currentProject.title,
            description: currentProject.description,
            imageURL: currentProject.imageURL,
            liveUrl: currentProject.liveUrl,
        };
        
        try {
            if (editingProject) {
                await updateProject(editingProject.id, projectData);
            } else {
                await addProject(projectData);
            }
            setSaveMessage('Project saved successfully!');
            handleCancelEdit();
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error("Error saving project:", error);
            setSaveMessage('Failed to save project.');
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
                setSaveMessage('Project deleted.');
                setTimeout(() => setSaveMessage(''), 3000);
            } catch (error) {
                console.error("Error deleting project:", error);
                setSaveMessage('Failed to delete project.');
            }
        }
    };

    if (authLoading) {
        return <div className="text-center py-12">Authenticating...</div>
    }

    if (!user) {
        return (
            <div className="max-w-md mx-auto py-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Admin Login</h2>
                <p className="text-text-dim mb-8">Please log in with your GitHub account to manage projects.</p>
                <button
                    onClick={handleGitHubLogin}
                    className="inline-flex items-center justify-center px-6 py-3 bg-base border-2 border-primary/50 text-primary font-bold rounded-lg hover:bg-primary/10 hover:shadow-glow-primary transition-all duration-300"
                >
                    <GitHubIcon className="mr-3" />
                    Login with GitHub
                </button>
                {loginError && <p className="text-red-500 mt-4">{loginError}</p>}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-sans font-bold">Admin Panel</h2>
                <button onClick={handleLogout} className="px-4 py-2 bg-secondary text-white font-bold rounded hover:bg-opacity-80 transition-colors">
                    Logout
                </button>
            </div>
            
            <motion.div className="bg-surface p-8 rounded-lg border border-primary/20 shadow-lg mb-12">
                <h3 className="text-2xl font-bold mb-4">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                    <input type="text" name="title" placeholder="Title" value={currentProject.title} onChange={handleInputChange} required className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none" />
                    <textarea name="description" placeholder="Description" value={currentProject.description} onChange={handleInputChange} required rows={3} className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none"></textarea>
                    <input type="url" name="liveUrl" placeholder="Live Site URL (e.g., https://example.com)" value={currentProject.liveUrl || ''} onChange={handleInputChange} className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none" />
                    
                    <div>
                        <input
                            type="url"
                            name="imageURL"
                            placeholder="Image URL from Cloudinary"
                            value={currentProject.imageURL || ''}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                        {currentProject.imageURL && (
                            <div className="mt-4">
                                <p className="text-sm text-text-dim mb-2">Image Preview:</p>
                                <img src={currentProject.imageURL} alt="Preview" className="w-32 h-32 object-cover rounded border border-primary/20" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 items-center">
                        <button type="submit" className="px-6 py-2 bg-primary text-base font-bold rounded hover:bg-opacity-80 transition-colors">
                            {editingProject ? 'Update Project' : 'Add Project'}
                        </button>
                        {editingProject && <button type="button" onClick={handleCancelEdit} className="px-6 py-2 bg-gray-500 text-white font-bold rounded hover:bg-opacity-80 transition-colors">Cancel</button>}
                        {saveMessage && <p className="text-green-500 text-sm">{saveMessage}</p>}
                    </div>
                </form>
            </motion.div>

            <div>
                <h3 className="text-3xl font-bold mb-6">Manage Projects</h3>
                {projectsLoading ? <p>Loading projects...</p> : projectsError ? <p className="text-red-500">Error: {projectsError}</p> : (
                    <div className="space-y-4">
                        {projects.map(project => (
                            <div key={project.id} className="bg-surface p-4 rounded-lg border border-primary/10 flex justify-between items-center flex-wrap">
                                <div className="mb-2 sm:mb-0">
                                    <h4 className="font-bold text-lg">{project.title}</h4>
                                    <p className="text-sm text-text-dim truncate max-w-xs">{project.description}</p>
                                </div>
                                <div className="space-x-2 flex-shrink-0">
                                    <button onClick={() => handleEdit(project)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded">Edit</button>
                                    <button onClick={() => handleDelete(project.id)} className="px-3 py-1 bg-red-600 text-white text-sm rounded">Delete</button>
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && <p className="text-center text-text-dim">No projects have been added yet.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;