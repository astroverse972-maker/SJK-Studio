import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/websites', name: 'Websites' },
  { path: '/contact', name: 'Contact' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const activeLinkStyle = {
    textShadow: '0 0 8px #d6d3d1',
    color: '#d6d3d1',
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          style={({ isActive }) => (isActive ? activeLinkStyle : {})}
          className="font-sans uppercase tracking-wider text-sm transition-colors duration-300 hover:text-primary hover:drop-shadow-[0_0_8px_#d6d3d1] text-text-main"
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
        className="container mx-auto flex justify-between items-center p-4 bg-base/50 backdrop-blur-lg border border-primary/20 rounded-lg shadow-lg"
      >
        <NavLink to="/">
          <div className="font-sans text-2xl font-bold tracking-tighter text-primary drop-shadow-[0_0_5px_#d6d3d1]">
            SJK Studio
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
          className="md:hidden fixed inset-0 bg-base/95 backdrop-blur-sm z-40 flex flex-col justify-center items-center space-y-8"
        >
          <NavLinks />
        </motion.div>
      )}
    </header>
  );
};

export default Header;