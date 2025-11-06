import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const ScrollIndicator: React.FC = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // This effect is responsible for SHOWING the indicator.
  // It checks if the page is scrollable after content has had time to load.
  useEffect(() => {
    // Reset state on navigation to ensure it re-evaluates for the new page
    setIsVisible(false);

    const checkAndShow = () => {
      const isScrollable = document.documentElement.scrollHeight > document.documentElement.clientHeight;
      // Only show if the page is scrollable AND the user hasn't already scrolled down
      if (isScrollable && window.scrollY <= 50) {
        setIsVisible(true);
      }
    };

    // A ResizeObserver is the most reliable way to know when content has changed page height
    const observer = new ResizeObserver(checkAndShow);
    observer.observe(document.body);
    
    // An initial check after a short delay as a fallback
    const timerId = setTimeout(checkAndShow, 300);

    // Cleanup when the component unmounts or path changes
    return () => {
      clearTimeout(timerId);
      observer.disconnect();
    };
  }, [pathname]);

  // This effect is responsible for HIDING the indicator on scroll
  useEffect(() => {
    // If the indicator isn't visible, we don't need a scroll listener
    if (!isVisible) return;

    const hideOnScroll = () => {
      // If user scrolls down, hide the indicator
      if (window.scrollY > 50) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', hideOnScroll, { passive: true });
    
    // Cleanup the listener when the component is hidden or unmounts
    return () => window.removeEventListener('scroll', hideOnScroll);
  }, [isVisible]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 10 
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed bottom-8 md:bottom-12 right-4 md:right-8 z-20 flex flex-col items-center pointer-events-none"
      aria-hidden={!isVisible}
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
