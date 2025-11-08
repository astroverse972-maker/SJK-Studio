import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import useProjects from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import { Project } from '../data/projects';
import AnimatedText from '../components/AnimatedText';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const Websites: React.FC = () => {
  const { projects, isLoading, error } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-sans font-bold text-center mb-4">
          <AnimatedText text="MY WORK" el="span" />
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
      </motion.div>

      {/* Category Filters */}
      {!isLoading && !error && projects.length > 0 && (
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 text-sm font-semibold rounded-full border transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-base border-primary shadow-glow-gold'
                  : 'bg-black/30 border-primary/20 text-text-main hover:bg-primary/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      )}

      {isLoading && <p className="text-center text-text-dim">Loading projects...</p>}
      {error && <p className="text-center text-red-500">Failed to fetch projects: {error}</p>}

      {!isLoading && !error && projects.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project: Project, index: number) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
            >
              <ProjectCard {...project} priority={index < 3} disableAnimation />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        !isLoading && !error && <p className="text-center text-text-dim">No projects have been added yet.</p>
      )}
    </div>
  );
};

export default Websites;