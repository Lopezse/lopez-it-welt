import Head from 'next/head';
import React from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  canonicalUrl?: string;
  noIndex?: boolean;
  children?: React.ReactNode;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
  children,
}) => {
  const fullTitle = `${title} | Lopez IT Welt`;
  const fullDescription = `${description} - Professionelle IT-Dienstleistungen mit Fokus auf Barrierefreiheit und persönliche Betreuung.`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={fullDescription} />
      <meta name='keywords' content={keywords.join(', ')} />
      <meta
        name='robots'
        content={noIndex ? 'noindex,nofollow' : 'index,follow'}
      />

      {/* Canonical URL */}
      {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={fullDescription} />
      <meta property='og:type' content={ogType} />
      <meta property='og:image' content={ogImage} />
      <meta property='og:site_name' content='Lopez IT Welt' />

      {/* Twitter Card */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={fullDescription} />
      <meta name='twitter:image' content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='theme-color' content='#1e40af' />
      <meta name='author' content='Lopez IT Welt' />

      {/* Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Lopez IT Welt',
            description: fullDescription,
            url: 'https://lopez-it-welt.de',
            logo: 'https://lopez-it-welt.de/logo.svg',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+49-XXX-XXXXXXX',
              contactType: 'customer service',
            },
          }),
        }}
      />

      {children}
    </Head>
  );
};
