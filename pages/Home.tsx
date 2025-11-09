import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitHubIcon, LinkedInIcon, MailIcon, SendIcon } from '../components/Icons';

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          <motion.div 
            className="flex flex-row md:flex-col items-center gap-8 order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
              <a href="https://github.com/ranvir80" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-dark transition-colors" aria-label="View my GitHub profile"><GitHubIcon className="w-6 h-6" /></a>
              <a href="https://www.linkedin.com/in/ranvirpardeshi/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-dark transition-colors" aria-label="View my LinkedIn profile"><LinkedInIcon className="w-6 h-6" /></a>
              <a href="mailto:pardeshiranvir156@gmail.com" className="text-gray-500 hover:text-brand-dark transition-colors" aria-label="Send me an email"><MailIcon className="w-6 h-6" /></a>
          </motion.div>

          <motion.div
            className="text-center md:text-left flex-1 order-1 md:order-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-brand-dark leading-tight">
              Ranvir Pardeshi
              <span className="animate-wave text-5xl md:text-6xl ml-4">👋</span>
            </h1>

            <p className="mt-4 text-lg md:text-xl text-brand-secondary">
              <span className="font-semibold text-brand-dark">AI Agent & Automation Developer</span>
            </p>

            <p className="mt-6 max-w-xl text-brand-secondary">
              I'm a student developer exploring the future of intelligent systems through AI-powered automation.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/contact" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-white bg-brand-dark hover:bg-black shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Say Hello <SendIcon className="w-5 h-5"/>
              </Link>
              <Link to="/about" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-brand-dark bg-white border-2 border-brand-border hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                About Me
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="hidden md:block order-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              <img src="https://picsum.photos/seed/ranvir-profile/400/400" alt="Ranvir Pardeshi" className="w-full h-full object-cover" width="400" height="400"/>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Home;