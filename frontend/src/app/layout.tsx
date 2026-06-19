import type { Metadata } from 'next';
import { Geist_Mono, Instrument_Serif, Inter, Newsreader } from 'next/font/google';
import Script from 'next/script';
import { AuthProvider } from '../context/auth-context';
import { ConsentBanner } from '../components/ConsentBanner';
import './globals.css';
import EmailSubscriptionModal from '../components/EmailSubscriptionModal';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-serif' });
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    default: 'Aperture',
    template: '%s | Aperture',
  },
  description: 'A warm editorial blog covering AI, personal finance, productivity, and the future of the web.',
  metadataBase: new URL('https://blogs.mannmate.com'),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Google Consent Mode v2 — must run before AdSense */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                ad_personalization: 'denied',
                ad_user_data: 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />
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
          <ConsentBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
