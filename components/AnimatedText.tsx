import React from 'react';
import { motion, Variants } from 'framer-motion';

type AnimatedTextProps = {
  text: string;
  el?: keyof React.JSX.IntrinsicElements;
  className?: string;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.015, // Fast stagger for a smooth ripple
    },
  },
};

const letterVariants: Variants = {
  hidden: {
    opacity: 0.3,
    color: '#8B7355', // Start with a dim, ambient brown/gold
    y: 3,
  },
  visible: {
    opacity: 1,
    color: '#F8F9FA', // Animate to the final bright text color
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 200,
      duration: 0.4
    },
  },
};

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, el: Wrapper = 'p', className }) => {
  const words = text.split(' ');

  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split('').map((letter, letterIndex) => (
              <motion.span
                key={letterIndex}
                variants={letterVariants}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
            {/* Add a space after each word */}
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
};

export default AnimatedText;