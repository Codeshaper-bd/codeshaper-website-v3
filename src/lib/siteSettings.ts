import data from "@/content/site.json";

/** Contact, footer and search defaults, edited in the CMS (Settings, Website). */
type SiteSettings = {
  /** booking: the Cal.com link every "Book a call" button opens (CMS › Settings › Contact › Booking calendar) */
  contact: { email?: string; support?: string; phone?: string; whatsapp?: string; address?: string; hours?: string; booking?: string; social?: Record<string, string> };
  /** products: CMS › Settings › Footer › Products (name + link) */
  footer: { products?: { label: string; href: string }[]; tagline?: string; button?: { label: string; href: string }; links?: { label: string; href: string }[]; places?: string[]; badges?: { title: string; subtitle?: string; href: string; color?: string }[]; copyright?: string };
  /** favicon: CMS › Search and sharing › Site icon (a picture from the media library) */
  seo: { title?: string; description?: string; image?: string; favicon?: string; google?: string; bing?: string; yandex?: string; facebook?: string; xHandle?: string; legalName?: string; founded?: number };
  /** analytics and ad tags (CMS › Settings › Analytics and tracking): IDs only; `consent: false` loads them without asking */
  tracking?: { ga4?: string; gtm?: string; metaPixel?: string; linkedin?: string; clarity?: string; consent?: false };
  /** robots.txt, llms.txt and IndexNow (CMS › Settings › AI and search engines); `false` turns a group of bots away */
  crawlers?: { aiSearch?: false; aiTraining?: false; indexnow?: string; robotsExtra?: string; llmsSummary?: string; llmsFacts?: string[]; llmsExtra?: string };
  /** the website address from CMS › Settings › General */
  url?: string;
  /** offices from CMS › Settings › Contact and social › Offices, in order */
  offices?: { key: string; title: string; city: string; country: string; lines?: string[]; tel?: string; zone?: string }[];
  /** homepage proof from CMS › Settings › Clients and figures */
  proof?: {
    years?: string;
    brands?: string;
    reviews?: string;
    clients?: { name: string; industry?: string; logo?: string; width?: number; wordmark?: true; hero?: true }[];
    countries?: { a3: string; count?: number }[];
  };
};
export const SITE = data as unknown as SiteSettings;
