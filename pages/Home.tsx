import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProjectSlider from '../components/ProjectSlider';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const letterContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' } },
};

const Home: React.FC = () => {
  const title = "SJK Studio.";

  return (
    <div 
      className="relative flex flex-col items-center justify-start pt-20 md:pt-24 min-h-[calc(100vh-8rem)] text-center"
    >
      <motion.div
        className="absolute w-64 h-64 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        className="absolute bottom-20 right-20 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"
      />

      <motion.div
        className="relative z-10 flex flex-col items-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-sans font-extrabold tracking-tighter"
          variants={letterContainerVariants}
        >
          {title.split('').map((char, index) => (
            char === ' ' ? <span key={index}>&nbsp;</span> :
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block relative text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
              whileHover={{ 
                scale: 1.1, 
                y: -10,
                color: '#FFBE00',
                textShadow: '0 0 15px #FFBE00',
                transition: { type: 'spring', stiffness: 300, damping: 10 }
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          className="mt-4 max-w-2xl text-lg md:text-xl text-text-dim"
          variants={letterVariants}
        >
          Every project is designed to look sharp, run smooth, and actually stand out.
        </motion.p>
        <motion.div variants={letterVariants} className="mt-10">
          <Link
            to="/websites"
            className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-primary bg-transparent border-2 border-primary rounded-md overflow-hidden transition-all duration-300 ease-out hover:shadow-glow-primary hover:text-white"
          >
            <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            <span className="relative z-10">View My Work</span>
            <ArrowRight className="ml-2 h-5 w-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <ProjectSlider />
      </motion.div>
    </div>
  );
};

export default Home;