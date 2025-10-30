import React from 'react';
import { motion, Variants } from 'framer-motion';
import AnimatedText from '../components/AnimatedText';

const attributes = [
  'Punctuality',
  'Reliability',
  'Communication',
  'Attention to detail',
];

const fadeIn = (direction = 'up', delay = 0): Variants => ({
    hidden: { 
        y: direction === 'up' ? 20 : -20,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            delay,
            duration: 0.6,
            ease: 'easeOut',
        },
    },
});

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={fadeIn('down')}>
        <h2 className="text-4xl font-sans font-bold text-center mb-4">
            <AnimatedText text="ABOUT ME" el="span" />
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
      </motion.div>
      
      <motion.div 
        className="grid md:grid-cols-5 gap-12 items-center bg-surface p-8 rounded-2xl border border-primary/20 shadow-lg backdrop-blur-xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="md:col-span-2">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <img 
              src="https://res.cloudinary.com/dubg7bfmv/image/upload/w_800,q_auto,f_auto/v1761039343/3-3_qfp2lk.jpg" 
              alt="SJK Studio"
              className="rounded-lg border-2 border-primary/50 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-glow-gold"
              loading="eager"
            />
          </motion.div>
        </div>
        <div className="md:col-span-3">
          <p className="text-lg text-text-dim">
            I build websites and apps that get noticed. Working with me isn’t for everyone, but for those who care about quality.
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-20 bg-surface p-8 rounded-2xl border border-primary/20 shadow-lg backdrop-blur-xl"
      >
        <motion.h3 variants={fadeIn('up')} className="text-3xl font-sans font-bold text-center mb-8">MY <span className="gradient-text">ATTRIBUTES</span></motion.h3>
        <div className="flex flex-wrap justify-center gap-4">
            {attributes.map((attribute, index) => (
                <motion.div
                    key={attribute}
                    variants={fadeIn('up', index * 0.1)}
                    className="bg-black/30 border border-primary/20 rounded-full px-6 py-2 text-text-main font-medium transition-all duration-300 hover:bg-primary/10 hover:shadow-glow-gold"
                >
                    {attribute}
                </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  );
};

export default About;