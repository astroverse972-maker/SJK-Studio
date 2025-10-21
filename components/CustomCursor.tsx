import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const cursorVariants = {
    default: {
      width: 200,
      height: 200,
      background: 'radial-gradient(circle, rgba(255, 190, 0, 0.25) 0%, rgba(255, 190, 0, 0) 35%)',
      borderRadius: '50%',
      scale: 1,
    },
    hover: {
      width: 200,
      height: 200,
      background: 'radial-gradient(circle, rgba(255, 190, 0, 0.4) 0%, rgba(255, 190, 0, 0) 35%)',
      borderRadius: '50%',
      scale: 1.2,
    },
  };

  return (
    <motion.div
      className="custom-cursor"
      style={{
        left: position.x,
        top: position.y,
        x: '-50%',
        y: '-50%',
      }}
      variants={cursorVariants}
      animate={isHovering ? 'hover' : 'default'}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  );
};

export default CustomCursor;