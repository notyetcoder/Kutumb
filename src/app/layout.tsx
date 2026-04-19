import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import MainHeader from '@/components/MainHeader';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kutumb - Family Tree Relationship Finder',
  description: 'Discover how you are connected in our community family tree',
  icons: {
    icon: '🌳',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <LanguageProvider>
          <MainHeader user={undefined} />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-16">
            <div className="container max-w-7xl mx-auto px-4 text-center text-gray-600">
              <p>🌳 Kutumb - Connecting Families, Preserving Heritage</p>
              <p className="text-sm mt-2">ગુજરાતી સમુદાય | Hindi समुदाय | English Community</p>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
