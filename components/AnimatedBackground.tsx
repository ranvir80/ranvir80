import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div className="relative w-full h-full">
        <div
          className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-premium-orange-100 rounded-full filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-accent-yellow-100 rounded-full filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDuration: '10s' }}
        ></div>
         <div
          className="absolute top-[30%] right-[10%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-premium-orange-100/50 rounded-full filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '3s' }}
        ></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;