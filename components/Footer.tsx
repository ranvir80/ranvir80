import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 mt-24">
      <div className="max-w-6xl mx-auto py-8 px-4 border-t border-gray-200">
        <div className="flex justify-center items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Ranvir Pardeshi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;