import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useProjects from '../hooks/useProjects';

const ProjectSlider: React.FC = () => {
    const { projects, isLoading, error } = useProjects();
    const duplicatedProjects = projects.length > 0 ? [...projects, ...projects] : [];
    
    return (
        <div className="mt-20 w-full">
            <h2 className="text-3xl font-sans font-bold text-center mb-8">
                Featured <span className="text-secondary">Work</span>
            </h2>

            {isLoading && <p className="text-center text-text-dim">Loading projects...</p>}
            {error && <p className="text-center text-red-500">Failed to fetch projects: {error}</p>}
            
            {!isLoading && !error && projects.length === 0 && (
                 <p className="text-center text-text-dim">No projects have been added yet.</p>
            )}

            {!isLoading && !error && projects.length > 0 && (
                <div 
                    className="slider-container relative w-full max-w-6xl mx-auto overflow-hidden py-4"
                >
                    <div
                        className="slider-track flex"
                        style={{
                            width: `${projects.length * 2 * 19}rem`,
                        }}
                    >
                        {duplicatedProjects.map((project, index) => (
                            <Link to={'/websites'} key={`${project.id}-${index}`} className="flex-shrink-0">
                                <motion.div 
                                    className="w-72 mx-4 relative"
                                    whileHover={{ scale: 1.05, y: -5, zIndex: 10 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                                >
                                    <div className="group relative bg-surface rounded-lg overflow-hidden border border-primary/10 transition-shadow duration-300">
                                        <img
                                            src={project.imageURL}
                                            alt={project.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <h3 className="text-primary font-bold text-lg text-center px-2">{project.title}</h3>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectSlider;
