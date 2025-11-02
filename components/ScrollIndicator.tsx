import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ScrollIndicator: React.FC = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      // Check if the page content is taller than the viewport
      const isContentScrollable = document.documentElement.scrollHeight > document.documentElement.clientHeight;
      // Check if the user has scrolled down past a small threshold
      const hasUserScrolled = window.scrollY > 50;
      
      // The indicator should only be visible if the page IS scrollable AND the user has NOT scrolled yet.
      setIsVisible(isContentScrollable && !hasUserScrolled);
    };

    // Use a ResizeObserver to detect when content size changes (e.g., images/data loading)
    const observer = new ResizeObserver(updateVisibility);
    // Observing the document body is more reliable for detecting overall page height changes.
    observer.observe(document.body);
    
    // Listen for scroll events to hide the indicator
    window.addEventListener('scroll', updateVisibility, { passive: true });
    
    // Initial check after a short delay to allow the first render to complete.
    const timerId = setTimeout(updateVisibility, 100);

    // Cleanup listeners when the component unmounts or path changes
    return () => {
      clearTimeout(timerId);
      observer.unobserve(document.body);
      window.removeEventListener('scroll', updateVisibility);
    };
  }, [pathname]);


  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 10 
      }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-8 md:bottom-12 right-4 md:right-8 z-20 flex flex-col items-center pointer-events-none"
      aria-hidden="true"
    >
      <div className="text-primary">
        <svg width="24" height="40" viewBox="0 0 24 40" className="stroke-current">
          <rect x="1" y="1" width="22" height="38" rx="11" strokeWidth="2" fill="none" />
          <motion.circle
            cx="12"
            cy="12"
            r="3"
            className="fill-current"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        </svg>
      </div>
      <p className="mt-3 text-sm uppercase tracking-widest text-primary font-sans font-light">
        SCROLL
      </p>
    </motion.div>
  );
};

export default ScrollIndicator;