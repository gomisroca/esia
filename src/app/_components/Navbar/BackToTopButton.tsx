'use client';

import { Limelight } from 'next/font/google';
import Link from 'next/link';

import scrollToTop from '@/utils/scrollToTop';

import Button from '../ui/Button';

const limelight = Limelight({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-limelight',
});

export default function BackToTopButton() {
  return (
    <Link href="/" className="pointer-events-none" aria-label="Back to top">
      <Button
        onClick={() => scrollToTop('smooth')}
        className={`${limelight.variable} pointer-events-auto rounded-l-none px-3 font-(family-name:--font-limelight) text-2xl font-bold md:rounded-sm`}>
        ESIA
      </Button>
    </Link>
  );
}
