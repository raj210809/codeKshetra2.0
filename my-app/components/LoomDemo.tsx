// components/LoomDemo.js
import React from 'react';

const LoomDemo = () => {
  return (
    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
      <iframe 
        src="https://www.loom.com/embed/b2c3f92be74940c18b2d82e72e69bc19?sid=2e09c426-131a-4617-8e25-20864967bd74" 
        frameBorder="0" 
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      ></iframe>
    </div>
  );
};

export default LoomDemo;
