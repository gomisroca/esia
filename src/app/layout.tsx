/**
 * Root layout component that wraps the entire application.
 *
 * @example
 * <RootLayout>
 *   <Component />
 * </RootLayout>
 */

import '@/styles/globals.css';

import { Arimo } from 'next/font/google';
import { type Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

import { TRPCReactProvider } from '@/trpc/react';

export const metadata: Metadata = {
  title: 'ESIA Gallery',
  description: 'Modern Art Gallery est. 2023',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};
const arimo = Arimo({ subsets: ['latin'] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={arimo.className}>
      <body>
        <ThemeProvider attribute="class">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
