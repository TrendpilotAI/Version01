export function formatLinkedInPost(content: string): string {
  // Remove excess whitespace
  let formatted = content.trim().replace(/\s+/g, ' ');
  
  // Add line breaks for readability
  formatted = formatted.replace(/\. /g, '.\n\n');
  
  // Format URLs
  formatted = formatted.replace(/(https?:\/\/\S+)/g, '\n$1\n');
  
  // Add relevant hashtags at the end
  const hashtags = '\n\n#Technology #Innovation #Business';
  
  return formatted + hashtags;
}