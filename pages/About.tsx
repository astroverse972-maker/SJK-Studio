import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Target, MessagesSquare, Clock, Users, Lightbulb, Construction, Rocket } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';

const philosophies = [
  {
    icon: Target,
    title: 'Pixel-Perfect Precision',
    description: 'Every detail matters. I ensure your vision is translated into a flawless, high-fidelity digital experience that works perfectly on all devices.'
  },
  {
    icon: MessagesSquare,
    title: 'Transparent Communication',
    description: 'Clear, consistent updates are key. You’ll always know the status of your project and be part of the process from start to finish.'
  },
  {
    icon: Clock,
    title: 'Reliable & On-Time',
    description: 'I respect your timeline and your budget. Projects are delivered punctually without compromising on the quality of the work.'
  },
  {
    icon: Users,
    title: 'User-Centric Design',
    description: 'The end-user is at the heart of my process. I build intuitive, accessible, and engaging interfaces that people love to use.'
  }
];

const processSteps = [
  {
    icon: Lightbulb,
    title: 'Step 1',
    description: "It all starts with your vision. Choose a demo as a starting point, or we can create something entirely new from scratch.",
    animation: {
      icon: { y: [0, -3, 0], scale: 1.15, rotate: [-4, 4, 0] },
      transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
    }
  },
  {
    icon: Construction,
    title: 'Step 2',
    description: "I bring your vision to life, coding a beautiful and functional website. You’ll get regular updates as your project takes shape.",
    animation: {
      icon: { rotate: [0, -12, 12, -8, 8, 0], scale: 1.1 },
      transition: { duration: 0.9, ease: "easeInOut" }
    }
  },
  {
    icon: Rocket,
    title: 'Step 3',
    description: "Your site goes live on its own domain (e.g., yourproject.com), ready for the world. Fast, secure, and built to impress.",
    animation: {
      icon: { y: -20, rotate: -6 },
      transition: { type: 'spring', stiffness: 300, damping: 10 }
    }
  }
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

const particleVariant = (delay: number) => ({
    initial: { y: 0, scale: 0, opacity: 0 },
    hover: { 
        y: [0, 20 + Math.random()*15], 
        scale: [0.5, 1.2, 0], 
        opacity: [0, 1, 0],
        transition: {
            duration: 0.9,
            delay: delay * 0.05,
            ease: "easeOut"
        }
    }
});

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      
      {/* SECTION 1: HOW IT WORKS */}
      <motion.div 
        className="mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div variants={fadeIn('up')}>
            <h2 className="text-4xl font-sans font-bold text-center mb-4">
                <AnimatedText text="HOW IT WORKS" el="span" />
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
                <motion.div
                    key={step.title}
                    variants={fadeIn('up', index * 0.15)}
                    whileHover="hover"
                    initial="initial"
                    className="group relative bg-surface p-8 rounded-2xl border border-primary/20 shadow-lg backdrop-blur-xl text-center flex flex-col items-center justify-start transition-all duration-300 hover:border-primary/40 hover:-translate-y-2 hover:shadow-glow-gold overflow-hidden"
                >
                    {/* Unique Backgrounds */}
                    {index === 0 && (
                        <motion.div 
                            className="absolute inset-0"
                            variants={{
                                hover: { background: 'radial-gradient(circle at 50% 30%, rgba(212, 165, 116, 0.2) 0%, transparent 70%)' },
                                initial: { background: 'radial-gradient(circle at 50% 30%, rgba(212, 165, 116, 0) 0%, transparent 70%)' }
                            }}
                            transition={{ duration: 0.5 }}
                        />
                    )}
                    {index === 1 && (
                         <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,rgba(212,165,116,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,165,116,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}

                    <div className="relative h-16 w-16 flex items-center justify-center">
                         <motion.div
                            variants={{ hover: step.animation.icon }}
                            transition={step.animation.transition}
                         >
                            <step.icon className="w-12 h-12 text-primary" />
                         </motion.div>
                         
                         {index === 2 && (
                             <>
                                <motion.div variants={particleVariant(1)} className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                <motion.div variants={particleVariant(2)} className="absolute bottom-0 left-[45%] w-2 h-2 bg-slate-300 rounded-full" />
                                <motion.div variants={particleVariant(3)} className="absolute bottom-0 left-[55%] w-1 h-1 bg-slate-300 rounded-full" />
                             </>
                         )}
                    </div>
                    
                    <h4 className="relative text-xl font-bold text-primary my-3">{step.title}</h4>
                    <p className="relative text-text-dim text-sm">
                        {step.description}
                    </p>
                </motion.div>
            ))}
        </div>
      </motion.div>

      {/* SECTION 2: ABOUT ME */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeIn('down')}>
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
              loading="lazy"
            />
          </motion.div>
        </div>
        <div className="md:col-span-3">
          <p className="text-lg text-text-dim">
            I build websites and apps that get noticed. Working with me isn’t for everyone, but for those who care about quality.
          </p>
        </div>
      </motion.div>

      {/* SECTION 3: MY PHILOSOPHY */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-20"
      >
        <motion.h3 variants={fadeIn('up')} className="text-3xl font-sans font-bold text-center mb-12">MY <span className="gradient-text">PHILOSOPHY</span></motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {philosophies.map((philosophy, index) => (
                <motion.div
                    key={philosophy.title}
                    variants={fadeIn('up', index * 0.1)}
                    className="group bg-surface p-6 rounded-2xl border border-primary/20 shadow-lg backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:border-primary/40 hover:-translate-y-2 hover:shadow-glow-gold"
                >
                    <div className="flex items-start space-x-4">
                        <div className="mt-1 flex-shrink-0">
                            <philosophy.icon className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <div className="flex-grow">
                            <h4 className="text-xl font-bold text-text-main mb-2">{philosophy.title}</h4>
                            <p className="text-text-dim text-sm max-h-0 opacity-0 transition-all duration-400 ease-in-out group-hover:max-h-40 group-hover:opacity-100">
                                {philosophy.description}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </motion.div>

    </div>
  );
};

export default About;