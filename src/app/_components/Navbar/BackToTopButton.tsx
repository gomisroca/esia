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
        className={`rounded-l-none px-2 text-2xl font-bold backdrop-blur-sm md:rounded-md ${limelight.className} pointer-events-auto bg-neutral-200/30 drop-shadow-md md:bg-transparent md:drop-shadow-none dark:bg-neutral-800/30`}>
        ESIA
      </Button>
    </Link>
  );
}

export default BackToTopButton;
