import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, Transition, Variants } from 'framer-motion';
import Header from './Header';
import ParticleBackground from './ParticleBackground';
import Spotlight from './Spotlight';
import Footer from './Footer';

const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const pageTransition: Transition = {
  duration: 0.25,
  ease: 'easeOut',
};

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Spotlight />
      <ParticleBackground />
      <div className="relative z-10 flex-grow bg-transparent text-text-main font-sans">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;