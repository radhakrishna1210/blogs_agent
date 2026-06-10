import type { Metadata } from 'next';
import { Geist_Mono, Instrument_Serif, Inter, Newsreader } from 'next/font/google';
import { AuthProvider } from '../context/auth-context';
import './globals.css';
import EmailSubscriptionModal from '../components/EmailSubscriptionModal';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-serif' });
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Aperture',
  description: 'A warm editorial blog built with Next.js and Tailwind CSS.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${newsreader.variable} ${instrumentSerif.variable} ${geistMono.variable}`}>
        <AuthProvider>
          {children}
          <EmailSubscriptionModal />
        </AuthProvider>
      </body>
    </html>
  );
}
