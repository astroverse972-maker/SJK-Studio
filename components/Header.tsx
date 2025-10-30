import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/websites', name: 'My Work' },
  { path: '/contact', name: 'Contact' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const activeLinkStyle = {
    color: '#D4A574', // primary gold color
    textShadow: '0 0 15px #D4A574',
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          style={({ isActive }) => (isActive ? activeLinkStyle : {})}
          className="font-sans uppercase tracking-wider text-sm transition-colors duration-300 hover:text-primary text-text-main"
          onClick={() => setIsOpen(false)}
        >
          {item.name}
        </NavLink>
      ))}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="container mx-auto flex justify-between items-center p-4 bg-black/50 backdrop-blur-xl border border-primary/20 rounded-lg shadow-lg"
      >
        <NavLink to="/">
          <div className="font-sans text-2xl font-bold tracking-tighter text-text-main">
            SJK <span className="text-primary">Studio</span>
          </div>
        </NavLink>
        <div className="hidden md:flex space-x-8 items-center">
          <NavLinks />
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-primary z-50">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-base/95 backdrop-blur-lg z-40 flex flex-col justify-center items-center space-y-8"
        >
          <NavLinks />
        </motion.div>
      )}
    </header>
  );
};

export default Header;