import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Project } from './ProjectCard';
import useProjects from '../hooks/useProjects';

const ProjectSlider: React.FC = () => {
    const projects = useProjects();
    // Duplicate the projects for a seamless, infinite loop
    const duplicatedProjects = projects.length > 0 ? [...projects, ...projects] : [];
    
    if (projects.length === 0) {
        return null;
    }

    return (
        <div 
            className="slider-container relative w-full max-w-6xl mx-auto overflow-hidden mt-20 py-4"
        >
            <div
                className="slider-track flex"
                style={{
                    width: `${projects.length * 2 * 19}rem`, // 18rem card width + 1rem margin
                }}
            >
                {duplicatedProjects.map((project, index) => (
                    <Link to={project.category === 'website' ? '/websites' : '/apps'} key={index} className="flex-shrink-0">
                        <motion.div 
                            className="w-72 mx-4 relative"
                            whileHover={{ scale: 1.05, y: -5, zIndex: 10 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                        >
                             <div className="group relative bg-surface rounded-lg overflow-hidden border border-primary/10 transition-shadow duration-300">
                                <img
                                    src={project.imageUrl}
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
    );
};

export default ProjectSlider;
