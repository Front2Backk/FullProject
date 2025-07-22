// src/components/MessageFormatter.tsx
import React from 'react';

interface MessageFormatterProps {
  text: string;
  className?: string;
}

const MessageFormatter: React.FC<MessageFormatterProps> = ({ text, className }) => {
  // Clean and validate the text first
  const cleanText = (text: string): string => {
    // Remove corrupted characters and fix encoding issues
    return text
      .replace(/[^\u0000-\u007F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '') // Keep only ASCII and Arabic characters
      .replace(/#{3,}/g, '###') // Limit multiple # to max 3
      .replace(/\*{3,}/g, '**') // Limit multiple * to max 2
      .replace(/\s{3,}/g, ' ') // Replace multiple spaces with single space
      .replace(/\n{3,}/g, '\n\n') // Limit multiple newlines to max 2
      .trim();
  };

  const formatMessage = (message: string) => {
    const cleanedMessage = cleanText(message);
    
    // Split by double newlines to create paragraphs
    const sections = cleanedMessage.split('\n\n').filter(p => p.trim());
    
    return sections.map((section, sectionIndex) => {
      const lines = section.split('\n').filter(l => l.trim());
      
      return (
        <div key={sectionIndex} className={`${sectionIndex > 0 ? 'mt-6' : ''}`}>
          {lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();
            
            // Skip empty or corrupted lines
            if (!trimmedLine || trimmedLine.length < 2) {
              return null;
            }
            
            // Handle main headers (### or ##)
            if (trimmedLine.match(/^#{1,3}\s+/)) {
              const headerText = trimmedLine.replace(/^#{1,3}\s+/, '');
              const level = (trimmedLine.match(/^#{1,3}/) || ['#'])[0].length;
              
              return (
                <h3 key={lineIndex} className={`font-bold text-white mb-4 ${
                  level === 1 ? 'text-xl' : level === 2 ? 'text-lg' : 'text-base'
                } border-l-4 border-blue-500 pl-4 bg-blue-600/10 py-2 rounded-r-lg`}>
                  {formatTextContent(headerText)}
                </h3>
              );
            }
            
            // Handle numbered lists (1., 2., etc.)
            if (/^\d+\./.test(trimmedLine)) {
              const number = trimmedLine.match(/^\d+\./)?.[0];
              const content = trimmedLine.replace(/^\d+\.\s*/, '');
              
              return (
                <div key={lineIndex} className="mb-4 flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-300 font-semibold text-sm">
                      {number?.replace('.', '')}
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    {formatTextContent(content)}
                  </div>
                </div>
              );
            }
            
            // Handle bullet points (• or - or *)
            if (/^[•\-*]\s/.test(trimmedLine)) {
              const content = trimmedLine.replace(/^[•\-*]\s*/, '');
              
              return (
                <div key={lineIndex} className="mb-3 flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2"></div>
                  <div className="flex-1">
                    {formatTextContent(content)}
                  </div>
                </div>
              );
            }
            
            // Handle subheaders (lines ending with :)
            if (trimmedLine.endsWith(':') && trimmedLine.length > 1) {
              return (
                <h4 key={lineIndex} className="font-bold text-white mb-3 text-base border-l-2 border-cyan-400 pl-3">
                  {formatTextContent(trimmedLine)}
                </h4>
              );
            }
            
            // Regular paragraph
            return (
              <div key={lineIndex} className={`leading-relaxed text-gray-100 ${lineIndex > 0 ? 'mt-3' : ''}`}>
                {formatTextContent(trimmedLine)}
              </div>
            );
          })}
        </div>
      );
    });
  };

  const formatTextContent = (text: string) => {
    // Handle **bold** text
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the bold part
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }
      
      // Add the bold part
      parts.push({
        type: 'bold',
        content: match[1]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    return parts.map((part, index) => {
      switch (part.type) {
        case 'bold':
          return (
            <span key={index} className="font-bold text-white bg-blue-600/15 px-1 rounded">
              {part.content}
            </span>
          );
        case 'text':
        default:
          return <span key={index}>{part.content}</span>;
      }
    });
  };

  return (
    <div className={className}>
      {formatMessage(text)}
    </div>
  );
};

export default MessageFormatter;