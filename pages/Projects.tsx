import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export const projectsData = [
  { id: 1, title: 'E-commerce Platform', description: 'A cutting-edge e-commerce platform with a focus on user experience.', tech: ['React', 'Next.js', 'Stripe'], imageUrl: 'https://picsum.photos/seed/alpha/600/400', category: 'website' },
  { id: 2, title: 'Data Viz Dashboard', description: 'Interactive data visualization dashboard for a fintech company.', tech: ['React', 'D3.js', 'TypeScript'], imageUrl: 'https://picsum.photos/seed/beta/600/400', category: 'website' },
  { id: 5, title: 'Corporate Redesign', description: 'Corporate website redesign with a focus on modern aesthetics.', tech: ['Gatsby', 'Contentful', 'Framer Motion'], imageUrl: 'https://picsum.photos/seed/epsilon/600/400', category: 'website' },
  { id: 3, title: 'Social Media App', description: 'A social media app for artists to showcase their work.', tech: ['React Native', 'Firebase', 'GraphQL'], imageUrl: 'https://picsum.photos/seed/gamma/600/400', category: 'app' },
  { id: 4, title: 'AI Content Tool', description: 'AI-powered content generation tool for marketing teams.', tech: ['Vue.js', 'Python', 'Gemini API'], imageUrl: 'https://picsum.photos/seed/delta/600/400', category: 'app' },
  { id: 6, title: 'Whiteboard App', description: 'A real-time collaborative whiteboard application.', tech: ['WebSockets', 'React', 'Canvas API'], imageUrl: 'https://picsum.photos/seed/zeta/600/400', category: 'app' },
];

const websites = projectsData.filter(p => p.category === 'website');
const apps = projectsData.filter(p => p.category === 'app');

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type Project = typeof projectsData[0];

const ProjectCard: React.FC<Project> = ({ title, description, tech, imageUrl }) => {
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
      className="group relative bg-surface rounded-lg overflow-hidden border border-primary/20 transition-all duration-300 hover:shadow-glow-gold"
      whileHover={{ y: -10, scale: 1.03 }}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
    >
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
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
      <div className="p-6 relative z-10">
        <motion.h3 
          className="text-2xl font-sans font-bold text-primary mb-2"
          style={{ transform: 'translateZ(50px)'}}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-text-dim mb-4"
          style={{ transform: 'translateZ(40px)'}}
        >
          {description}
        </motion.p>
        <motion.div 
          className="flex flex-wrap gap-2"
          style={{ transform: 'translateZ(30px)'}}
        >
          {tech.map((t) => (
            <span key={t} className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

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

      <section id="websites">
        <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-3xl font-sans font-bold text-center mb-8 text-secondary"
        >
            WEBSITES
        </motion.h3>
        <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {websites.map((project) => (
            <ProjectCard key={project.id} {...project} />
            ))}
        </motion.div>
      </section>

      <section id="apps" className="mt-20">
        <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-3xl font-sans font-bold text-center mb-8 text-secondary"
        >
            APPS
        </motion.h3>
        <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-container"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {apps.map((project) => (
            <ProjectCard key={project.id} {...project} />
            ))}
        </motion.div>
      </section>

    </div>
  );
};

export default Projects;