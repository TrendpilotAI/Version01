export function formatTwitterPost(content: string): string {
  // Remove excess whitespace
  let formatted = content.trim().replace(/\s+/g, ' ');
  
  // Ensure URLs are properly spaced
  formatted = formatted.replace(/(\S)(https?:\/\/\S+)/g, '$1 $2');
  
  // Add hashtags for key terms (example implementation)
  const keywords = ['AI', 'ML', 'Tech', 'Data'];
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    formatted = formatted.replace(regex, `#${keyword}`);
  });

  return formatted;
}