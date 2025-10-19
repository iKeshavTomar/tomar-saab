
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { Toggle } from './components/Toggle';
import { ComparisonSlider } from './components/ComparisonSlider';
import { Spinner } from './components/Spinner';
import { enhanceImage } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [preserveFaces, setPreserveFaces] = useState<boolean>(true);

  const handleImageUpload = (imageDataUrl: string) => {
    setOriginalImage(imageDataUrl);
    setEnhancedImage(null);
    setError(null);
  };

  const handleEnhance = useCallback(async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    setEnhancedImage(null);

    try {
      const result = await enhanceImage(originalImage, preserveFaces);
      setEnhancedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, preserveFaces]);

  const handleDownload = () => {
    if (!enhancedImage) return;
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = 'enhanced-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartOver = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <Header />
        <main className="mt-8">
          {!originalImage ? (
            <ImageUploader onImageUpload={handleImageUpload} />
          ) : (
            <div className="flex flex-col items-center space-y-6">
              {isLoading && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex flex-col justify-center items-center z-50">
                  <Spinner />
                  <p className="mt-4 text-lg font-medium text-teal-400 animate-pulse">
                    Enhancing your image... This may take a moment.
                  </p>
                </div>
              )}
              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {enhancedImage && originalImage ? (
                <ComparisonSlider beforeImage={originalImage} afterImage={enhancedImage} />
              ) : (
                <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <img src={originalImage} alt="Original to be enhanced" className="max-w-full max-h-[60vh] mx-auto rounded-md" />
                  <p className="text-center mt-2 text-sm text-gray-400">Original Image</p>
                </div>
              )}

              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-4">
                {!isLoading && !enhancedImage && (
                    <>
                        <Toggle
                          label="Preserve Faces"
                          enabled={preserveFaces}
                          onChange={setPreserveFaces}
                        />
                        <Button onClick={handleEnhance} disabled={isLoading}>
                          ✨ Enhance Image
                        </Button>
                    </>
                )}

                {enhancedImage && (
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button onClick={handleDownload} variant="primary">
                      Download Enhanced Image
                    </Button>
                    <Button onClick={handleStartOver} variant="secondary">
                      Start Over
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
