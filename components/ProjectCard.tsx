import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Project } from '../data/projects';

// This variant is for the initial page load animation (staggering cards in)
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
};

type ProjectCardProps = Project & {
    priority?: boolean;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, imageURL, tech, author, liveUrl, priority = false }) => {
  return (
    // We keep this motion.div for the initial stagger animation of the grid.
    <motion.div
      variants={itemVariants}
      className="group relative bg-surface rounded-lg overflow-hidden border border-primary/20 transition-all duration-300 ease-in-out hover:shadow-glow-gold hover:-translate-y-2 flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img
            src={imageURL}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            loading={priority ? 'eager' : 'lazy'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        {author && (
          <span 
              className="absolute top-2 right-2 bg-secondary/80 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
              {author}
          </span>
        )}
      </div>
      <div className="p-6 relative z-10 flex-grow flex flex-col">
        <h3 className="text-2xl font-sans font-bold text-primary mb-2">
          {title}
        </h3>
        
        {/* The description is now always visible */}
        <p className="text-text-dim mb-4 flex-grow">
          {description}
        </p>
        
        {/* The tech stack and link are also always visible */}
        <div>
            {tech && tech.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto mb-6">
                    {tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                        {t}
                    </span>
                    ))}
                </div>
            )}
            {liveUrl && (
                <div>
                    <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-bold text-gold bg-transparent border-2 border-gold rounded-md transition-all duration-300 ease-out hover:bg-gold hover:text-base hover:shadow-glow-gold"
                    onClick={(e) => e.stopPropagation()}
                    >
                    View Live Site
                    <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;