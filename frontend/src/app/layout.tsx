import type { Metadata } from 'next';
import { Geist_Mono, Instrument_Serif, Inter, Newsreader } from 'next/font/google';
import Script from 'next/script';
import { AuthProvider } from '../context/auth-context';
import './globals.css';
import EmailSubscriptionModal from '../components/EmailSubscriptionModal';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-serif' });
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

const SITE_URL = 'https://blogs.mannmate.com';
const SITE_DESCRIPTION =
  'Aperture is an editorial blog with practical articles and guides on AI and technology, personal finance, productivity, health and wellness, careers, startups, and modern life.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Aperture — Articles & Guides on Tech, Money, Health & Modern Life',
    template: '%s | Aperture',
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Aperture',
    title: 'Aperture — Articles & Guides on Tech, Money, Health & Modern Life',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aperture — Articles & Guides on Tech, Money, Health & Modern Life',
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3656534810825959" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3656534810825959"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} ${newsreader.variable} ${instrumentSerif.variable} ${geistMono.variable}`}>
        <AuthProvider>
          {children}
          <EmailSubscriptionModal />
        </AuthProvider>
      </body>
    </html>
  );
}
