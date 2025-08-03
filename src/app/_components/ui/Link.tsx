import NextLink from 'next/link';
import { twMerge } from 'tailwind-merge';

export default function Link({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <NextLink
      href={href}
      className={twMerge(
        'm-auto w-fit border-b-2 border-black bg-white/80 px-2 py-1 text-lg font-semibold transition-transform duration-200 ease-in hover:scale-110 active:scale-95 dark:border-white dark:bg-black/80',
        className
      )}>
      {children}
    </NextLink>
  );
}
