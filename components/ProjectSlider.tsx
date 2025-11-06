import React, { useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import useProjects from '../hooks/useProjects';

const ProjectSlider: React.FC = () => {
    const { projects, isLoading, error } = useProjects();
    const duplicatedProjects = projects.length > 0 ? [...projects, ...projects] : [];
    
    const controls = useAnimation();
    const x = useMotionValue(0);

    const totalWidth = projects.length * 26 * 16; // 26rem (w-96) + 2rem (mx-4) * 16px/rem
    const baseDuration = 40 * projects.length / 4; // Scale duration with number of projects

    const startInfiniteLoop = () => {
        if (totalWidth <= 0) return;
        controls.start({
            x: -totalWidth,
        }, {
            duration: baseDuration,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
        });
    };
    
    useEffect(() => {
        if (projects.length > 0) {
            startInfiniteLoop();
        }
        return () => controls.stop();
    }, [projects.length, totalWidth, baseDuration]);
    
    const handleInteractionStart = () => {
        controls.stop();
    };

    const handleInteractionEnd = () => {
        if (totalWidth <= 0) return;
        // After interaction, calculate where we are and animate to the end of the current visual cycle.
        const currentX = x.get();
        const normalizedX = currentX % totalWidth;
        
        // This ensures if a user drags far past the end, we snap back to the equivalent visual position.
        if (normalizedX !== currentX) {
            x.set(normalizedX);
        }
        
        const remainingDistance = totalWidth + normalizedX; // normalizedX is negative
        const duration = baseDuration * (remainingDistance / totalWidth);
        
        // Animate to the end of the current "visual" loop
        controls.start({ x: -totalWidth }, { ease: "linear", duration })
            .then(() => {
                // IMPORTANT: After the partial animation completes, teleport to x=0 before starting the infinite loop.
                // This is crucial for a seamless transition.
                x.set(0); 
                startInfiniteLoop();
            });
    };

    return (
        <div className="mt-20 w-full">
            <h2 className="text-3xl font-sans font-bold text-center mb-8">
                My <span className="gradient-text">Work</span>
            </h2>

            {isLoading && <p className="text-center text-text-dim">Loading projects...</p>}
            {error && <p className="text-center text-red-500">Failed to fetch projects: {error}</p>}
            
            {!isLoading && !error && projects.length === 0 && (
                 <p className="text-center text-text-dim">No projects have been added yet.</p>
            )}

            {!isLoading && !error && projects.length > 0 && (
                <div 
                    className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden py-4 cursor-grab active:cursor-grabbing"
                >
                    <motion.div
                        className="flex"
                        style={{ x }}
                        animate={controls}
                        drag="x"
                        dragConstraints={{ 
                            left: -(totalWidth * 2), // Allow dragging through the entire duplicated list
                            right: 0 
                        }}
                        dragTransition={{ bounceStiffness: 200, bounceDamping: 25 }}
                        onHoverStart={handleInteractionStart}
                        onHoverEnd={handleInteractionEnd}
                        onDragStart={handleInteractionStart}
                        onDragEnd={handleInteractionEnd}
                    >
                        {duplicatedProjects.map((project, index) => (
                            <Link to={'/websites'} key={`${project.id}-${index}`} className="flex-shrink-0" draggable="false">
                                <motion.div 
                                    className="w-96 mx-4 relative"
                                    style={{ flexShrink: 0 }}
                                    whileHover={{ scale: 1.05, y: -5, zIndex: 10 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                                >
                                    <div className="group relative bg-surface rounded-lg overflow-hidden border border-primary/10 transition-shadow duration-300 aspect-[2.09/1]">
                                        <img
                                            src={project.imageURL}
                                            alt={project.title}
                                            className="w-full h-full object-cover pointer-events-none"
                                        />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <h3 className="text-primary font-bold text-lg text-center px-2">{project.title}</h3>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ProjectSlider;