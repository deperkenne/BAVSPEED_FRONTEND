import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-4 flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
