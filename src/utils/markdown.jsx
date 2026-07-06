import React from 'react';

/**
 * Safely parses text containing markdown-like **bold** and *italic* tokens
 * into React elements without using dangerouslySetInnerHTML.
 */
export function parseMarkdown(text) {
  if (!text) return '';

  // Regex to split on bold (**text**) or italic (*text*) markers
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
