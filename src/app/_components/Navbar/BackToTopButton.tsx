'use client';

/**
 * Back to top button component.
 * @example
 * <BackToTopButton />
 */

import { Limelight } from 'next/font/google';
const limelight = Limelight({ weight: '400', subsets: ['latin'] });

import Button from '../ui/Button';
import scrollToTop from '@/utils/scrollToTop';
import Link from 'next/link';

function BackToTopButton() {
  return (
    <Link href="/" className="pointer-events-none" aria-label="Back to top">
      <Button
        ariaLabel="Back to top"
        onClick={() => scrollToTop('smooth')}
        className={`rounded-l-none px-2 text-2xl font-bold text-neutral-800 backdrop-blur-sm dark:text-neutral-200 md:rounded-md ${limelight.className} pointer-events-auto bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:bg-transparent md:drop-shadow-none`}>
        ESIA
      </Button>
    </Link>
  );
}

export default BackToTopButton;
