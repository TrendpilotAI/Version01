export function formatInstagramPost(content: string): string {
  // Remove excess whitespace
  let formatted = content.trim().replace(/\s+/g, ' ');
  
  // Add line breaks for readability
  formatted = formatted.replace(/\. /g, '.\n\n');
  
  // Move hashtags to the end
  const hashtags = content.match(/#\w+/g) || [];
  formatted = formatted.replace(/#\w+/g, '').trim();
  
  if (hashtags.length > 0) {
    formatted += '\n\n' + hashtags.join(' ');
  }
  
  // Add default hashtags if none present
  if (hashtags.length === 0) {
    formatted += '\n\n#TrendPilot #Innovation #Technology';
  }

  return formatted;
}