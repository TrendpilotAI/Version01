typescript
export interface NewsletterTemplateProps {
  content: {
    logo: ImageData;
    issueNumber: number;
    date: string;
    title: string;
    subtitle?: string;
    heroImage?: ImageData;
    articles: Article[];
    quickLinks: QuickLink[];
    highlights: Highlight[];
    companyInfo: CompanyInfo;
    socialLinks: SocialLink[];
    unsubscribeUrl: string;
  };
  personalizations?: {
    recipientName?: string;
    customFields?: Record<string, string>;
  };
}

export interface ImageData {
  url: string;
  alt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  image?: ImageData;
  ctaText: string;
  ctaUrl: string;
}

export interface QuickLink {
  id: string;
  text: string;
  url: string;
}

export interface Highlight {
  id: string;
  title: string;
  description: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface NewsletterHeaderProps {
  logo: ImageData;
  issueNumber: number;
  date: string;
}

export interface NewsletterHeroProps {
  title: string;
  subtitle?: string;
  image?: ImageData;
}

export interface NewsletterContentProps {
  articles: Article[];
}

export interface NewsletterSidebarProps {
  quickLinks: QuickLink[];
  highlights: Highlight[];
}

export interface NewsletterFooterProps {
  companyInfo: CompanyInfo;
  socialLinks: SocialLink[];
  unsubscribeUrl: string;
}

export interface ArticleProps {
  title: string;
  content: string;
  image?: ImageData;
  callToAction: React.ReactNode;
}
```