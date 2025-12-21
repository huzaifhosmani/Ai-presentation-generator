
import React from 'react';
import type { Slide } from '../types';
import { IconTrash } from './Icons';

interface SlideEditorProps {
  index: number;
  slide: Slide;
  updateSlide: (index: number, field: keyof Slide, value: string) => void;
  removeSlide: (index: number) => void;
  isOnlySlide: boolean;
}

const SlideEditor: React.FC<SlideEditorProps> = ({ index, slide, updateSlide, removeSlide, isOnlySlide }) => {
  return (
    <div className="border border-indigo-200 p-6 rounded-xl bg-gradient-to-br from-white to-indigo-50 shadow-lg relative group hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
         <span className="text-sm font-bold text-indigo-700 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full border border-indigo-300 shadow-sm">
           Slide {index + 1}
        </span>
        <button
          onClick={() => removeSlide(index)}
          className="text-slate-400 hover:text-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed p-2 rounded-lg hover:bg-red-50"
          aria-label={`Remove slide ${index + 1}`}
          disabled={isOnlySlide}
        >
          <IconTrash className="h-5 w-5" />
        </button>
      </div>

      <input
        type="text"
        value={slide.title}
        onChange={(e) => updateSlide(index, 'title', e.target.value)}
        className="w-full mb-3 p-4 border border-indigo-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
        placeholder="Slide Title"
      />
      <textarea
        value={slide.content}
        onChange={(e) => updateSlide(index, 'content', e.target.value)}
        className="w-full p-4 border border-indigo-300 rounded-xl text-slate-700 h-36 resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
        placeholder="Slide Content (use new lines for bullet points)"
        rows={5}
      ></textarea>
    </div>
  );
};

export default SlideEditor;
