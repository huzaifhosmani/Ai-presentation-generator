import React from 'react';
import type { Slide } from '../types';

interface SlidePreviewProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ slide, slideNumber, totalSlides }) => {
  const bulletPoints = slide.content.split('\n').filter(line => line.trim());

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border-4 border-indigo-200 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white p-8">
        <h1 className="text-4xl font-bold text-center tracking-tight">{slide.title}</h1>
      </div>
      <div className="p-10 min-h-[450px] flex flex-col justify-center bg-gradient-to-b from-white to-slate-50">
        <ul className="space-y-6 text-xl text-slate-800 leading-relaxed">
          {bulletPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="text-indigo-500 mr-4 text-2xl mt-1">▸</span>
              <span className="flex-1">{point.trim()}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 text-center text-sm text-slate-600 font-medium">
        Slide {slideNumber} of {totalSlides}
      </div>
    </div>
  );
};

export default SlidePreview;