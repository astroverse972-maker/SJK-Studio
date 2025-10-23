import React, { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../components/ProjectCard';

const Admin: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [saveError, setSaveError] = useState<string>('');
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const emptyProject: Omit<Project, 'id' | 'author'> = {
        title: '',
        description: '',
        tech: [],
        imageUrl: '',
        category: 'website',
        liveUrl: '',
    };

    const [currentProject, setCurrentProject] = useState<Omit<Project, 'id'> & { id?: number, techString: string }>(
        { ...emptyProject, author: 'SJK Studio', techString: '' }
    );
    
    useEffect(() => {
        const loggedIn = sessionStorage.getItem('sjk-studio-admin-logged-in');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
            loadProjects();
        }
    }, []);
    
    const loadProjects = async () => {
        setIsLoading(true);
        setSaveError('');
        try {
            const response = await fetch('https://sjkstudio.vercel.app/api/projects');
            if (!response.ok) throw new Error('Failed to load projects');
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            console.error("Failed to load projects from API", err);
            setSaveError(err instanceof Error ? err.message : 'Failed to load projects.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const saveProjects = async (updatedProjects: Project[]) => {
        setSaveError('');
        try {
            const response = await fetch('https://sjkstudio.vercel.app/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProjects),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save projects.');
            }
            
            setProjects(updatedProjects); // Update local state on successful save
            return true;
        } catch (err) {
            console.error("Failed to save projects to API", err);
            setSaveError(err instanceof Error ? err.message : 'Failed to save projects.');
            return false;
        }
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoginError('');
        try {
            const response = await fetch('https://sjkstudio.vercel.app/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsLoggedIn(true);
                sessionStorage.setItem('sjk-studio-admin-logged-in', 'true');
                loadProjects();
            } else {
                setLoginError(data.message || 'Login failed.');
            }
        } catch (err) {
            setLoginError('An error occurred during login.');
        }
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        setPassword('');
        sessionStorage.removeItem('sjk-studio-admin-logged-in');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentProject(prev => ({ ...prev, [name]: value }));
    };
    
    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setCurrentProject({ ...project, techString: project.tech.join(', ') });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleCancelEdit = () => {
        setEditingProject(null);
        setCurrentProject({ ...emptyProject, author: 'SJK Studio', techString: '' });
    };

    const handleProjectSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const projectData: Project = {
            id: editingProject ? editingProject.id : Date.now(),
            title: currentProject.title,
            description: currentProject.description,
            author: currentProject.author,
            tech: currentProject.techString.split(',').map(t => t.trim()).filter(Boolean),
            imageUrl: currentProject.imageUrl,
            category: 'website', // Hardcode category to 'website'
            liveUrl: currentProject.liveUrl
        };
        
        let updatedProjects;
        if (editingProject) {
            updatedProjects = projects.map(p => p.id === projectData.id ? projectData : p);
        } else {
            updatedProjects = [...projects, projectData];
        }
        
        const success = await saveProjects(updatedProjects);
        if (success) {
            handleCancelEdit();
        }
    };
    
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            const updatedProjects = projects.filter(p => p.id !== id);
            await saveProjects(updatedProjects);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="max-w-md mx-auto py-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                    <button type="submit" className="px-6 py-2 bg-primary text-base-dark font-bold rounded hover:bg-opacity-80 transition-colors">
                        Login
                    </button>
                    {loginError && <p className="text-red-500 mt-4">{loginError}</p>}
                </form>
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
                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" name="title" placeholder="Title" value={currentProject.title} onChange={handleInputChange} required className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none" />
                        <input type="text" name="author" placeholder="Author" value={currentProject.author} onChange={handleInputChange} required className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <textarea name="description" placeholder="Description" value={currentProject.description} onChange={handleInputChange} required rows={3} className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none"></textarea>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" name="imageUrl" placeholder="Image URL" value={currentProject.imageUrl} onChange={handleInputChange} required className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none" />
                        <input type="text" name="liveUrl" placeholder="Live Site URL (Optional)" value={currentProject.liveUrl || ''} onChange={handleInputChange} className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <input type="text" name="techString" placeholder="Tech Stack (comma-separated)" value={currentProject.techString} onChange={handleInputChange} required className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none" />
                    <div className="flex gap-4 items-center">
                        <button type="submit" className="px-6 py-2 bg-primary text-base-dark font-bold rounded hover:bg-opacity-80 transition-colors">
                            {editingProject ? 'Update Project' : 'Add Project'}
                        </button>
                        {editingProject && <button type="button" onClick={handleCancelEdit} className="px-6 py-2 bg-gray-500 text-white font-bold rounded hover:bg-opacity-80 transition-colors">Cancel</button>}
                        {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
                    </div>
                </form>
            </motion.div>

            <div>
                <h3 className="text-3xl font-bold mb-6">Manage Projects</h3>
                {isLoading ? (
                    <p className="text-text-dim">Loading projects...</p>
                ) : (
                    <div className="space-y-4">
                        {projects.map(project => (
                            <div key={project.id} className="bg-surface p-4 rounded-lg border border-primary/10 flex justify-between items-center flex-wrap">
                                <div className="mb-2 sm:mb-0">
                                    <h4 className="font-bold text-lg">{project.title}</h4>
                                    <p className="text-sm text-text-dim capitalize">{project.category}</p>
                                </div>
                                <div className="space-x-2 flex-shrink-0">
                                    <button onClick={() => handleEdit(project)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded">Edit</button>
                                    <button onClick={() => handleDelete(project.id)} className="px-3 py-1 bg-red-600 text-white text-sm rounded">Delete</button>
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && <p className="text-text-dim">No projects found. Add one above!</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;