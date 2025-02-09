export function formatFacebookPost(content: string): string {
  // Remove excess whitespace
  let formatted = content.trim().replace(/\s+/g, ' ');
  
  // Add line breaks for readability
  formatted = formatted.replace(/\. /g, '.\n\n');
  
  // Format URLs
  formatted = formatted.replace(/(https?:\/\/\S+)/g, '\n$1\n');
  
  // Convert hashtags to be more natural in sentences
  formatted = formatted.replace(/#(\w+)/g, '$1');

  return formatted;
}