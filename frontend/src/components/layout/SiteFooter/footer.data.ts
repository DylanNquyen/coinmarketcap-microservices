export type FooterLink = {
  label: string;
  href: string;
  badge?: string;
};

export type FooterGroup = {
  title: string;
  links: FooterLink[];
};

export const footerGroups: FooterGroup[] = [
  {
    title: 'Products',
    links: [
      { label: 'Academy', href: '#academy' },
      { label: 'Advertise', href: '#advertise' },
      { label: 'CMC Labs', href: '#labs' },
      { label: 'Top Stories', href: '#stories' },
      { label: 'Crypto API', href: '#api' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Watchlist', href: '#watchlist' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '#about' },
      { label: 'Terms of use', href: '#terms' },
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Cookie preferences', href: '#cookies' },
      {
        label: 'Careers',
        href: '#careers',
        badge: "We're hiring!",
      },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Get listed', href: '#get-listed' },
      { label: 'Request Form', href: '#request' },
      { label: 'Contact Support', href: '#support' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Glossary', href: '#glossary' },
    ],
  },
  {
    title: 'Socials',
    links: [
      { label: 'X (Twitter)', href: '#twitter' },
      { label: 'Community', href: '#community' },
      { label: 'Telegram', href: '#telegram' },
      { label: 'Instagram', href: '#instagram' },
      { label: 'Facebook', href: '#facebook' },
      { label: 'Reddit', href: '#reddit' },
      { label: 'LinkedIn', href: '#linkedin' },
    ],
  },
];