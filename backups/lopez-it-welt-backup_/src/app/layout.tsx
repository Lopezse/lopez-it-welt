import { I18nProvider } from '@/components/Features/I18nProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lopez IT Welt - Enterprise++ IT-Lösungen',
  description:
    'Professionelle IT-Dienstleistungen, Webentwicklung und Enterprise-Lösungen von Lopez IT Welt. Moderne Technologien, deutsche Qualität.',
  keywords:
    'IT-Dienstleistungen, Webentwicklung, Enterprise, Next.js, React, TypeScript',
  authors: [{ name: 'Ramiro Lopez' }],
  creator: 'Lopez IT Welt',
  publisher: 'Lopez IT Welt',
  robots: 'index, follow',
  openGraph: {
    title: 'Lopez IT Welt - Enterprise++ IT-Lösungen',
    description:
      'Professionelle IT-Dienstleistungen, Webentwicklung und Enterprise-Lösungen',
    type: 'website',
    locale: 'de_DE',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='de'>
      <body className={inter.className}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
