import React, { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../components/ProjectCard';

const Admin: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [projects, setProjects] = useState<Project[]>([]);
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
    
    const loadProjects = () => {
        try {
            const localProjects = localStorage.getItem('sjk-studio-projects');
            if (localProjects) {
                setProjects(JSON.parse(localProjects));
            }
        } catch (err) {
            console.error("Failed to load projects from local storage", err);
            setError('Failed to load projects.');
        }
    };
    
    const saveProjects = (updatedProjects: Project[]) => {
        try {
            localStorage.setItem('sjk-studio-projects', JSON.stringify(updatedProjects));
            setProjects(updatedProjects);
        } catch (err) {
            console.error("Failed to save projects to local storage", err);
            setError('Failed to save projects.');
        }
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/login', {
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
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            setError('An error occurred during login.');
        }
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        sessionStorage.removeItem('sjk-studio-admin-logged-in');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentProject(prev => ({ ...prev, [name]: value }));
    };
    
    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setCurrentProject({ ...project, techString: project.tech.join(', ') });
    };
    
    const handleCancelEdit = () => {
        setEditingProject(null);
        setCurrentProject({ ...emptyProject, author: 'SJK Studio', techString: '' });
    };

    const handleProjectSubmit = (e: FormEvent) => {
        e.preventDefault();
        const projectData: Project = {
            id: editingProject ? editingProject.id : Date.now(),
            title: currentProject.title,
            description: currentProject.description,
            author: currentProject.author,
            tech: currentProject.techString.split(',').map(t => t.trim()).filter(Boolean),
            imageUrl: currentProject.imageUrl,
            category: currentProject.category,
            liveUrl: currentProject.liveUrl
        };
        
        let updatedProjects;
        if (editingProject) {
            updatedProjects = projects.map(p => p.id === projectData.id ? projectData : p);
        } else {
            updatedProjects = [...projects, projectData];
        }
        
        saveProjects(updatedProjects);
        handleCancelEdit();
    };
    
    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            const updatedProjects = projects.filter(p => p.id !== id);
            saveProjects(updatedProjects);
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
                    {error && <p className="text-red-500 mt-4">{error}</p>}
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
                    <select name="category" value={currentProject.category} onChange={handleInputChange} className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none">
                        <option value="website">Website</option>
                        <option value="app">App</option>
                    </select>
                    <div className="flex gap-4">
                        <button type="submit" className="px-6 py-2 bg-primary text-base-dark font-bold rounded hover:bg-opacity-80 transition-colors">
                            {editingProject ? 'Update Project' : 'Add Project'}
                        </button>
                        {editingProject && <button type="button" onClick={handleCancelEdit} className="px-6 py-2 bg-gray-500 text-white font-bold rounded hover:bg-opacity-80 transition-colors">Cancel</button>}
                    </div>
                </form>
            </motion.div>

            <div>
                <h3 className="text-3xl font-bold mb-6">Manage Projects</h3>
                <div className="space-y-4">
                    {projects.map(project => (
                        <div key={project.id} className="bg-surface p-4 rounded-lg border border-primary/10 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-lg">{project.title}</h4>
                                <p className="text-sm text-text-dim">{project.category}</p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => handleEdit(project)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded">Edit</button>
                                <button onClick={() => handleDelete(project.id)} className="px-3 py-1 bg-red-600 text-white text-sm rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && <p className="text-text-dim">No projects found. Add one above!</p>}
                </div>
            </div>
        </div>
    );
};

export default Admin;