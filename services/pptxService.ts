
import PptxGenJS from "pptxgenjs";
import type { Slide } from "../types";

// --- Presentation Theme/Constants ---
const THEME = {
  BACKGROUND_COLOR: "F1F5F9",
  TITLE_FONT_COLOR: "0F172A",
  CONTENT_FONT_COLOR: "334155",
  ACCENT_COLOR: "2563EB",
  TITLE_FONT_FACE: "Arial",
  CONTENT_FONT_FACE: "Calibri",
};

export const exportToPptx = (topic: string, slides: Slide[]): void => {
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "AI Presentation Generator";
  pptx.company = "Powered by Gemini";
  pptx.subject = topic;
  pptx.title = topic || "Presentation";

  // --- Master Slide Definitions ---
  // Define a master slide for title slides
  pptx.defineSlideMaster({
    title: "MASTER_TITLE",
    background: { color: THEME.BACKGROUND_COLOR },
    objects: [
      {
        rect: {
          x: 0, y: 0, w: "100%", h: 0.5, fill: { color: THEME.ACCENT_COLOR } 
        },
      },
      {
        text: {
          text: "AI Presentation Generator",
          options: { x: 0.5, y: 8.8, w: "95%", align: "right", fontFace: THEME.CONTENT_FONT_FACE, fontSize: 10, color: "A0A0A0" },
        },
      },
    ],
  });

  // Define a master slide for content slides
  pptx.defineSlideMaster({
    title: "MASTER_CONTENT",
    background: { color: THEME.BACKGROUND_COLOR },
    objects: [
      {
        rect: {
          x: 0, y: 0, w: "100%", h: 0.5, fill: { color: THEME.ACCENT_COLOR } 
        },
      },
      {
        placeholder: {
          options: { name: "title", type: "title", x: 0.5, y: 0.7, w: 12, h: 1.0, fontFace: THEME.TITLE_FONT_FACE, fontSize: 32, color: THEME.TITLE_FONT_COLOR, bold: true },
          text: "Placeholder Title",
        },
      },
      {
        placeholder: {
          options: { name: "body", type: "body", x: 0.5, y: 2.0, w: 12, h: 6, fontFace: THEME.CONTENT_FONT_FACE, fontSize: 18, color: THEME.CONTENT_FONT_COLOR, bullet: true },
          text: "Placeholder Body",
        },
      },
      {
        text: {
          text: "AI Presentation Generator",
          options: { x: 0.5, y: 8.8, w: "95%", align: "right", fontFace: THEME.CONTENT_FONT_FACE, fontSize: 10, color: "A0A0A0" },
        },
      },
    ],
  });

  // --- Generate Slides ---
  slides.forEach((slideData, index) => {
    if (index === 0) {
      // First slide is the Title Slide
      const slide = pptx.addSlide({ masterName: "MASTER_TITLE" });
      slide.addText(slideData.title, {
        x: 0.5,
        y: 3.5,
        w: "95%",
        h: 1.5,
        align: "center",
        fontFace: THEME.TITLE_FONT_FACE,
        fontSize: 44,
        bold: true,
        color: THEME.TITLE_FONT_COLOR,
      });
      slide.addText(slideData.content, {
        x: 0.5,
        y: 5.0,
        w: "95%",
        h: 1,
        align: "center",
        fontFace: THEME.CONTENT_FONT_FACE,
        fontSize: 20,
        color: THEME.CONTENT_FONT_COLOR,
      });
    } else {
      // All other slides are Content Slides
      const slide = pptx.addSlide({ masterName: "MASTER_CONTENT" });
      slide.addText(slideData.title, { placeholder: "title" });
      
      // Process content for bullet points
      const processContent = (content: string) => {
        // Split by newlines first
        let lines = content.split('\n').filter(line => line.trim() !== '');

        // If no newlines, try to split by common bullet markers or sentences
        if (lines.length === 1) {
          const line = lines[0];
          // Check for dash bullets
          if (line.includes(' - ')) {
            lines = line.split(' - ').filter(item => item.trim() !== '');
          }
          // Check for asterisk bullets
          else if (line.includes(' * ')) {
            lines = line.split(' * ').filter(item => item.trim() !== '');
          }
          // Split by periods for sentences (fallback)
          else if (line.includes('. ')) {
            lines = line.split('. ').filter(item => item.trim() !== '' && item.length > 10);
          }
        }

        return lines.map(line => ({
          text: line.replace(/^[-*•]\s*/, '').trim(), // Remove leading bullets/dashes/asterisks
          options: {
            bullet: true,
            fontFace: THEME.CONTENT_FONT_FACE,
            fontSize: 20,
            color: THEME.CONTENT_FONT_COLOR,
            paraSpaceAfter: 12,
            lineSpacing: 32
          }
        }));
      };

      const contentWithOptions = processContent(slideData.content);

      if(contentWithOptions.length > 0) {
        slide.addText(contentWithOptions, { placeholder: "body" });
      }
    }
  });

  // --- Download Presentation ---
  pptx.writeFile({ fileName: `${topic.replace(/\s+/g, '_') || "Presentation"}.pptx` });
};
