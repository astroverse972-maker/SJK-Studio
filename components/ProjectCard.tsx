import React, { useRef } from 'react';
// FIX: Import `Variants` for explicit typing.
import { motion, useMotionValue, useTransform, useSpring, Variants } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

// FIX: Added `Variants` type to ensure correct contextual typing for the `ease` property,
// which resolves the error where an array literal was inferred as `number[]` instead of a tuple.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1], // Professional deceleration easing curve
    },
  },
};

export type Project = {
    id: number;
    title: string;
    description: string;
    tech: string[];
    imageUrl: string;
    category: string;
    author: string;
    liveUrl?: string;
};

type ProjectCardProps = Project & {
    priority?: boolean;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, tech, imageUrl, author, liveUrl, priority = false }) => {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { stiffness: 200, damping: 25, mass: 0.1 };

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const glareX = useTransform(mouseX, [-0.5, 0.5], [100, -100]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [100, -100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={itemVariants}
      className="group relative bg-surface rounded-lg overflow-hidden border border-primary/20 transition-all duration-300 hover:shadow-glow-gold flex flex-col"
      whileHover={{ y: -10, scale: 1.03 }}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
    >
      <div className="relative">
        <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? 'eager' : 'lazy'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <motion.div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-10"
            style={{
                background: useTransform(
                  [glareX, glareY],
                  ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.4), transparent)`
                ),
            }}
        />
        <motion.span 
            className="absolute top-2 right-2 bg-secondary/80 text-white text-xs font-bold px-2 py-1 rounded-full"
            style={{ transform: 'translateZ(60px)'}}
        >
            {author}
        </motion.span>
      </div>
      <div className="p-6 relative z-10 flex-grow flex flex-col">
        <motion.h3 
          className="text-2xl font-sans font-bold text-primary mb-2"
          style={{ transform: 'translateZ(50px)'}}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-text-dim mb-4 flex-grow"
          style={{ transform: 'translateZ(40px)'}}
        >
          {description}
        </motion.p>
        <motion.div 
          className="flex flex-wrap gap-2 mt-auto"
          style={{ transform: 'translateZ(30px)'}}
        >
          {tech.map((t) => (
            <span key={t} className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
              {t}
            </span>
          ))}
        </motion.div>
        {liveUrl && (
          <motion.div
            className="mt-6"
            style={{ transform: 'translateZ(20px)'}}
          >
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-bold text-gold bg-transparent border-2 border-gold rounded-md transition-all duration-300 ease-out hover:bg-gold hover:text-base hover:shadow-glow-gold"
              onClick={(e) => e.stopPropagation()} // Prevents the card's tilt from resetting on click
            >
              View Live Site
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;