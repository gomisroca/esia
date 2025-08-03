'use client';

/**
 * Back to top button component.
 * @example
 * <BackToTopButton />
 */

import { Limelight } from 'next/font/google';
import Link from 'next/link';

import scrollToTop from '@/utils/scrollToTop';

import Button from '../ui/Button';

const limelight = Limelight({ weight: '400', subsets: ['latin'] });

function BackToTopButton() {
  return (
    <Link href="/" className="pointer-events-none" aria-label="Back to top">
      <Button
        ariaLabel="Back to top"
        onClick={() => scrollToTop('smooth')}
        className={`rounded-l-none px-3 text-2xl font-bold md:rounded-sm ${limelight.className} pointer-events-auto`}>
        ESIA
      </Button>
    </Link>
  );
}

export default BackToTopButton;
