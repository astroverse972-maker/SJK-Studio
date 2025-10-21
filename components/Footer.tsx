import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 py-8 text-center text-text-dim border-t border-primary/10">
        <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} SJK Studio. All Rights Reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;