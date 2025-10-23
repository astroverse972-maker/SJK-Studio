import React, { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase/config';
import { Project } from '../data/projects';
import useProjects from '../hooks/useProjects';

// This makes the Cloudinary widget available globally in this component
declare var cloudinary: any;

type CurrentProjectState = {
    id?: string;
    title: string;
    description: string;
    imageURL: string;
};

const Admin: React.FC = () => {
    const [user, setUser] = useState<any | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');
    
    const { projects, addProject, updateProject, deleteProject, isLoading: projectsLoading, error: projectsError } = useProjects();
    const [saveMessage, setSaveMessage] = useState<string>('');
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const emptyProject = {
        title: '',
        description: '',
        imageURL: '',
    };

    const [currentProject, setCurrentProject] = useState<CurrentProjectState>(emptyProject);
    
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setAuthLoading(false);
        });
    
        return () => subscription.unsubscribe();
    }, []);

    const uploadWidget = React.useRef<any>(null);
    useEffect(() => {
        // Initialize Cloudinary Upload Widget
        uploadWidget.current = cloudinary.createUploadWidget({
            cloudName: 'YOUR_CLOUD_NAME', // IMPORTANT: Add your Cloudinary cloud name here
            uploadPreset: 'YOUR_UPLOAD_PRESET' // IMPORTANT: Add your unsigned upload preset here
        }, (error: any, result: any) => { 
            if (!error && result && result.event === "success") { 
                console.log('Done! Here is the image info: ', result.info);
                setCurrentProject(prev => ({ ...prev, imageURL: result.info.secure_url }));
            }
        });
    }, []);
    
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoginError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setLoginError('Login failed. Please check your email and password.');
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
            imageURL: project.imageURL
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const handleCancelEdit = () => {
        setEditingProject(null);
        setCurrentProject(emptyProject);
    };

    const handleProjectSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentProject.imageURL) {
            setSaveMessage('Please upload an image for the project.');
            return;
        }
        setSaveMessage('Saving...');
        
        const projectData = {
            title: currentProject.title,
            description: currentProject.description,
            imageURL: currentProject.imageURL,
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
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                    <button type="submit" className="px-6 py-2 bg-primary text-base font-bold rounded hover:bg-opacity-80 transition-colors">
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
                    <input type="text" name="title" placeholder="Title" value={currentProject.title} onChange={handleInputChange} required className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none" />
                    <textarea name="description" placeholder="Description" value={currentProject.description} onChange={handleInputChange} required rows={3} className="w-full bg-base p-3 rounded border border-text-dim/30 focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none"></textarea>
                    
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={() => uploadWidget.current.open()} className="px-6 py-2 bg-gold text-base font-bold rounded hover:bg-opacity-80 transition-colors">
                            Upload Image
                        </button>
                        {currentProject.imageURL && <img src={currentProject.imageURL} alt="Preview" className="w-20 h-20 object-cover rounded" />}
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
