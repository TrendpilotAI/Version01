export function formatThreadsPost(content: string): string {
  // Remove excess whitespace
  let formatted = content.trim().replace(/\s+/g, ' ');
  
  // Add line breaks for readability
  formatted = formatted.replace(/\. /g, '.\n');
  
  // Format URLs to be on their own line
  formatted = formatted.replace(/(https?:\/\/\S+)/g, '\n$1');
  
  // Add subtle formatting for emphasis
  formatted = formatted.replace(/(!+)/g, ' $1');

  return formatted;
}