import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProjectSlider from '../components/ProjectSlider';
import AnimatedText from '../components/AnimatedText';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const DeconstructedUIElement = () => {
    const [isClicked, setIsClicked] = useState(false);
    const [orbitRadius, setOrbitRadius] = useState(150);
    const heroRef = useRef<HTMLDivElement>(null);

    // For mouse tilt
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    
    // For touch drag
    const dragX = useMotionValue(0);
    const dragY = useMotionValue(0);
    const springConfig = { stiffness: 300, damping: 20 };
    const springDragX = useSpring(dragX, springConfig);
    const springDragY = useSpring(dragY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
          if (heroRef.current) {
            const { left, top, width, height } = heroRef.current.getBoundingClientRect();
            mouseX.set( (e.clientX - left) / width );
            mouseY.set( (e.clientY - top) / height );
          }
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        const updateRadius = () => {
            if (window.innerWidth < 768) setOrbitRadius(90);
            else if (window.innerWidth < 1024) setOrbitRadius(120);
            else setOrbitRadius(150);
        };
        updateRadius();
        window.addEventListener('resize', updateRadius);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', updateRadius);
        }
    }, [mouseX, mouseY]);

    const rotateX = useTransform(mouseY, [0, 1], [-20, 20]);
    const rotateY = useTransform(mouseX, [0, 1], [20, -20]);

    // Combine mouse tilt and touch drag rotations
    const combinedRotateX = useTransform(() => rotateX.get() + springDragY.get());
    const combinedRotateY = useTransform(() => rotateY.get() + springDragX.get());
    
    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 500);
    };

    const transition = { type: 'spring', stiffness: 200, damping: 15 };

    return (
        <motion.div
            ref={heroRef}
            className="relative w-full h-auto aspect-square cursor-grab active:cursor-grabbing"
            style={{ 
                transformStyle: 'preserve-d',
                perspective: '1000px',
                rotateX: combinedRotateX,
                rotateY: combinedRotateY,
            }}
            whileHover={{ scale: 1.02 }}
            onClick={handleClick}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDrag={(event, info) => {
                // We're updating the drag motion values directly for the spring
                dragX.set(info.offset.x);
                dragY.set(info.offset.y);
                // Reset mouse tilt values during drag to prevent conflict
                mouseX.set(0.5);
                mouseY.set(0.5);
            }}
            onDragEnd={() => {
                // Snap back to neutral drag position
                dragX.set(0);
                dragY.set(0);
            }}
        >
            {/* Base Card */}
            <motion.div
                className="absolute inset-8 bg-white/5 backdrop-blur-sm border border-primary/20 rounded-lg"
                animate={{ transform: isClicked ? 'translateZ(-60px)' : 'translateZ(-20px)' }}
                transition={transition}
            >
                <div className="absolute top-4 left-4 right-4 h-6 bg-primary/10 rounded-sm" />
                <div className="absolute top-6 left-6 w-2 h-2 rounded-full bg-secondary/50" />
                <div className="absolute top-6 left-10 w-2 h-2 rounded-full bg-secondary/50" />
                <div className="absolute top-6 left-14 w-2 h-2 rounded-full bg-secondary/50" />
            </motion.div>

            <motion.div
                className="absolute top-[35%] left-[25%] w-1/2 h-3 bg-primary/20 rounded-sm"
                animate={{ transform: isClicked ? 'translateZ(80px)' : 'translateZ(40px)' }}
                transition={transition}
            />
            
            <motion.div
                className="absolute top-[45%] left-[25%] w-1/3 h-3 bg-secondary/30 rounded-sm"
                animate={{ transform: isClicked ? 'translateZ(60px)' : 'translateZ(20px)' }}
                transition={transition}
            />

            <motion.div
                className="absolute bottom-[25%] left-[25%] w-1/4 h-8 bg-primary/80 rounded-md shadow-lg"
                animate={{ transform: isClicked ? 'translateZ(120px)' : 'translateZ(60px)' }}
                transition={transition}
            />

            <motion.div
                className="absolute top-[25%] right-[10%] w-1/5 h-1/2 bg-white/5 backdrop-blur-sm border border-accent-cyan/20 rounded-md"
                animate={{ transform: isClicked ? 'translateZ(140px) rotateY(20deg)' : 'translateZ(80px) rotateY(20deg)' }}
                transition={transition}
            />

            <motion.div
              className="absolute w-2 h-2 bg-accent-cyan rounded-full shadow-lg"
              style={{ top: '50%', left: '50%'}}
              animate={{
                transform: [
                  `rotate(0deg) translateX(${orbitRadius}px) rotate(0deg)`,
                  `rotate(360deg) translateX(${orbitRadius}px) rotate(-360deg)`
                ],
                scale: isClicked ? 1.5 : 1,
              }}
              transition={{ 
                  transform: { duration: 12, repeat: Infinity, ease: 'linear' },
                  scale: transition
              }}
            />
        </motion.div>
    );
};

const InteractiveTitle = ({ title }: { title: string }) => {
    return (
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-extrabold tracking-tighter text-text-main">
            {title.split('').map((char, index) => (
                <motion.span
                    key={index}
                    whileHover={{
                        scale: 1.1,
                        y: -5,
                        color: '#F5B041',
                        textShadow: '0 0 20px rgba(245, 176, 65, 0.7)',
                        transition: { duration: 0.2, type: 'spring', stiffness: 400, damping: 10 }
                    }}
                    className="inline-block cursor-pointer"
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </h1>
    );
};


const Home: React.FC = () => {
  return (
    <>
      <div 
        id="hero-container"
        className="relative flex flex-row items-center justify-center"
      >
        <div className="w-5/12 flex justify-center">
          <DeconstructedUIElement />
        </div>

        <motion.div
          className="w-7/12 flex flex-col items-start text-left z-10 pl-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <InteractiveTitle title="SJK Studio" />
          </motion.div>
          
          <motion.div
            className="mt-4 max-w-xl text-sm md:text-lg text-text-dim"
            variants={itemVariants}
          >
            <AnimatedText text="Every website is designed to look sharp, run smooth, and actually stand out." />
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-6 md:mt-10">
            <Link
              to="/websites"
              className="group relative inline-flex items-center justify-center px-4 py-2 text-sm md:px-8 md:py-4 md:text-lg font-bold text-base bg-gradient-to-r from-primary to-yellow-600 rounded-lg overflow-hidden transition-all duration-300 ease-out shadow-lg hover:shadow-glow-gold animate-pulse-glow"
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">View My Work</span>
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 relative z-10 transform group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <ProjectSlider />
    </>
  );
};

export default Home;