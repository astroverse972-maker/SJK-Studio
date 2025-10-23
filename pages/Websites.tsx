import React from 'react';
import { motion } from 'framer-motion';
import useProjects from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../data/projects';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Websites: React.FC = () => {
  const { projects, isLoading, error } = useProjects();

  return (
    <div className="max-w-6xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-sans font-bold text-center mb-4">
            MY <span className="text-primary">WORK</span>
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
      </motion.div>

      {isLoading && <p className="text-center text-text-dim">Loading projects...</p>}
      {error && <p className="text-center text-red-500">Failed to fetch projects: {error}</p>}
      
      {!isLoading && !error && projects.length > 0 ? (
        <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {projects.map((project: Project, index: number) => (
              <ProjectCard key={project.id} {...project} priority={index < 3} />
            ))}
        </motion.div>
      ) : (
        !isLoading && !error && <p className="text-center text-text-dim">No projects have been added yet.</p>
      )}
    </div>
  );
};

export default Websites;
