import { useState } from 'react';

export function useEditor() {
  const [content, setContent] = useState('');

  const generateContent = async (topic: string, tone: string) => {
    // TODO: Implement AI content generation
    console.log('Generating content for:', { topic, tone });
  };

  return {
    content,
    setContent,
    generateContent,
  };
}