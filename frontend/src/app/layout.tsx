import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '../components/layout/Header';
import { Toast } from '../components/ui/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EvalSystem - Evaluation Management',
  description: 'Comprehensive evaluation management system for educational institutions',
  keywords: 'evaluation, management, education, assessment, competency',
  authors: [{ name: 'EvalSystem Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-secondary-50">
          <Header />
          <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-200">
            {children}
          </main>
        </div>
        <Toast />
      </body>
    </html>
  );
}