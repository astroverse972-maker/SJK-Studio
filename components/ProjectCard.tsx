import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Project } from '../data/projects';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
};

type ProjectCardProps = Project & {
    priority?: boolean;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, imageURL, liveUrl, priority = false }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -10, boxShadow: '0 20px 60px rgba(212, 165, 116, 0.3)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className="group bg-surface rounded-2xl overflow-hidden border border-primary/20 flex flex-col backdrop-blur-2xl"
    >
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={imageURL}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          loading={priority ? 'eager' : 'lazy'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl font-sans font-bold text-primary mb-2">
            {title}
          </h3>
          <p className="text-text-dim mb-4 text-sm flex-grow">
            {description}
          </p>
          {liveUrl && (
              <div className="mt-auto">
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/button inline-flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-base bg-gradient-to-r from-primary to-yellow-600 rounded-md transition-all duration-300 ease-out hover:shadow-glow-gold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Live Site
                    <ExternalLink className="ml-2 h-4 w-4 transform group-hover/button:translate-x-1 transition-transform" />
                  </a>
              </div>
          )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;