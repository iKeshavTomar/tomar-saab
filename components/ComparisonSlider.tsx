
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    handleMove(event.clientX);
  }, [handleMove]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    handleMove(event.touches[0].clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);
  
  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    isDragging.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);
  
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    isDragging.current = true;
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto aspect-video cursor-ew-resize select-none overflow-hidden rounded-lg shadow-2xl border-2 border-gray-700"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <img src={beforeImage} alt="Before" className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={afterImage} alt="After" className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />
      </div>
      <div
        className="absolute top-0 h-full w-1.5 bg-teal-400/80 cursor-ew-resize pointer-events-none transform -translate-x-1/2"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 bg-teal-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
        </div>
      </div>
      <div className="absolute top-2 left-4 px-3 py-1 bg-black/50 text-white text-sm font-bold rounded-full pointer-events-none">BEFORE</div>
      <div className="absolute top-2 right-4 px-3 py-1 bg-black/50 text-white text-sm font-bold rounded-full pointer-events-none" style={{ opacity: sliderPosition > 50 ? 1 : 0, transition: 'opacity 0.3s'}}>AFTER</div>
    </div>
  );
};
