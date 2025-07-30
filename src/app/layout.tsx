/**
 * Root layout component that wraps the entire application.
 *
 * @example
 * <RootLayout>
 *   <Component />
 * </RootLayout>
 */

import '@/styles/globals.css';

import { type Metadata } from 'next';
import { Arimo } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import { TRPCReactProvider } from '@/trpc/react';

import Navbar from './_components/Navbar';

export const metadata: Metadata = {
  title: 'ESIA Gallery',
  description: 'Explore contemporary masterpieces and curated exhibitions.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};
const arimo = Arimo({ subsets: ['latin'] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={arimo.className} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">
          <TRPCReactProvider>
            <div style={{ backgroundImage: "url('/bg.jpg')" }} className="bg-cover bg-fixed bg-center bg-no-repeat">
              <main className="min-h-screen items-center justify-center bg-gradient-to-b from-slate-300/95 via-sky-300/80 to-cyan-300/70 text-neutral-950 dark:from-slate-900/95 dark:via-sky-900/80 dark:to-cyan-900/70 dark:text-neutral-50">
                <Navbar />
                <div className="container mx-auto flex w-full flex-col items-center justify-center gap-12 px-4 pb-8 md:pb-4">
                  {children}
                </div>
              </main>
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
