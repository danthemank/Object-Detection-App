import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function formatMarkdown(markdown) {
  if (!markdown) return '';
  
  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  // Convert markdown to HTML and sanitize
  const html = marked(markdown);
  const sanitizedHtml = DOMPurify.sanitize(html);
  
  return sanitizedHtml;
}
