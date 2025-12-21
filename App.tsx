
import React, { useState, useCallback } from 'react';
import type { Slide } from './types';
import { generatePresentationContent } from './services/geminiService';
import { exportToPptx } from './services/pptxService';
import { IconBrain, IconPlus, IconTrash, IconDownload, IconSparkles, IconLoader } from './components/Icons';
import SlideEditor from './components/SlideEditor';
import SlidePreview from './components/SlidePreview';

const App: React.FC = () => {
   const [topic, setTopic] = useState<string>('');
   const [slides, setSlides] = useState<Slide[]>([
     { title: "Welcome!", content: "Enter a topic above and click 'Generate Slides' to get started." }
   ]);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
   const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const handleGenerateSlides = useCallback(async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const generatedSlides = await generatePresentationContent(topic);
      setSlides(generatedSlides);
      setCurrentSlideIndex(0);
    } catch (e) {
      console.error(e);
      setError("Failed to generate slides. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  const addSlide = () => {
    setSlides([...slides, { title: "New Slide", content: "Edit this content." }]);
  };

  const removeSlide = (index: number) => {
    const updatedSlides = slides.filter((_, i) => i !== index);
    setSlides(updatedSlides);
  };

  const updateSlide = (index: number, field: keyof Slide, value: string) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    setSlides(updatedSlides);
  };

  const handleDownload = () => {
    exportToPptx(topic, slides);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50 font-sans text-slate-900 relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-indigo-50/20 to-transparent"></div>
      <div className="relative z-10">
      <header className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <IconBrain className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI Presentation Generator
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <div className="mb-6">
            <label htmlFor="topic" className="block text-sm font-medium text-slate-600 mb-2">
              Presentation Topic
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                id="topic"
                type="text"
                placeholder="e.g., The Future of Renewable Energy"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-grow w-full p-4 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm text-lg"
                disabled={isLoading}
              />
              <button
                onClick={handleGenerateSlides}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <IconLoader className="animate-spin h-5 w-5" />
                    Generating...
                  </>
                ) : (
                  <>
                    <IconSparkles className="h-5 w-5" />
                    Generate Slides
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-slate-100 p-1 rounded-xl shadow-inner">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  viewMode === 'edit'
                    ? 'bg-white text-indigo-700 shadow-md'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                ✏️ Edit Mode
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  viewMode === 'preview'
                    ? 'bg-white text-indigo-700 shadow-md'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                👁️ Preview Mode
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {viewMode === 'edit' ? (
              slides.map((slide, index) => (
                <SlideEditor
                  key={index}
                  index={index}
                  slide={slide}
                  updateSlide={updateSlide}
                  removeSlide={removeSlide}
                  isOnlySlide={slides.length === 1}
                />
              ))
            ) : (
              <div className="flex flex-col items-center">
                <SlidePreview
                  slide={slides[currentSlideIndex]}
                  slideNumber={currentSlideIndex + 1}
                  totalSlides={slides.length}
                />
                <div className="flex items-center gap-6 mt-8">
                  <button
                    onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                    disabled={currentSlideIndex === 0}
                    className="px-6 py-3 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 rounded-xl font-semibold hover:from-slate-300 hover:to-slate-400 disabled:from-slate-100 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    ← Previous
                  </button>
                  <span className="text-lg text-slate-600 font-medium bg-white px-4 py-2 rounded-lg shadow-sm">
                    {currentSlideIndex + 1} of {slides.length}
                  </span>
                  <button
                    onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                    disabled={currentSlideIndex === slides.length - 1}
                    className="px-6 py-3 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 rounded-xl font-semibold hover:from-slate-300 hover:to-slate-400 disabled:from-slate-100 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-end gap-4">
            {viewMode === 'edit' && (
              <button
                onClick={addSlide}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:from-slate-300 hover:to-slate-400 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <IconPlus className="h-5 w-5" />
                Add Slide
              </button>
            )}
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <IconDownload className="h-5 w-5" />
              Download PPTX
            </button>
          </div>
        </div>
      </main>
      <footer className="text-center py-8 text-slate-600 text-sm bg-gradient-to-r from-slate-50 to-blue-50">
        <p className="font-medium">Powered by Huzaif  • Designed with Tailwind CSS</p>
      </footer>
      </div>
    </div>
  );
};

export default App;
