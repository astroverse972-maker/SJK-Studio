import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Websites from './pages/Websites';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AuthCallback from './pages/AuthCallback';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="websites" element={<Websites />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
          <Route path="auth-callback" element={<AuthCallback />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;