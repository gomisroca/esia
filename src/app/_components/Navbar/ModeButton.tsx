'use client';

/**
 * Mode button component.
 *
 * @example
 * <ModeButton />
 */

import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa6';

import Button from '../ui/Button';

function ModeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      ariaLabel="Theme Button"
      onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
      className="rounded-r-none bg-neutral-200/30 drop-shadow-md md:rounded-md md:bg-transparent md:drop-shadow-none dark:bg-neutral-800/30">
      <FaSun className="size-[1.2rem] scale-100 rotate-0 text-neutral-800 transition-all dark:scale-0 dark:-rotate-90" />
      <FaMoon className="absolute size-[1.2rem] scale-0 rotate-90 text-neutral-200 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Theme</span>
    </Button>
  );
}
export default ModeButton;
