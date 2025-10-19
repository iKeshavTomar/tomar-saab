
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
        Image Clarity Enhancer
      </h1>
      <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
        Upload your image to upscale resolution, remove noise, and sharpen details with the power of AI.
      </p>
    </header>
  );
};
