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

function BackToTopButton() {
  return (
    <Button
      onClick={() => scrollToTop('smooth')}
      className={`rounded-md px-2 text-2xl font-bold text-neutral-800 backdrop-blur-sm dark:text-neutral-200 ${limelight.className} pointer-events-auto`}>
      ESIA
    </Button>
  );
}

export default BackToTopButton;
