
import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (JPG, PNG).');
    }
  }, [onImageUpload]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const dragClasses = isDragging ? 'border-teal-400 bg-gray-800' : 'border-gray-600';

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-8 sm:p-12 text-center border-2 border-dashed rounded-xl transition-colors duration-300 ${dragClasses}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="imageUpload"
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleChange}
      />
      <label htmlFor="imageUpload" className="cursor-pointer">
        <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-5 text-xl font-semibold text-gray-300">
          Drag & drop your image here
        </p>
        <p className="mt-2 text-sm text-gray-500">or click to browse</p>
        <p className="mt-1 text-xs text-gray-600">PNG, JPG, JPEG up to 10MB</p>
      </label>
    </div>
  );
};
