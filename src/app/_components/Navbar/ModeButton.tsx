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
      className="rounded-r-none md:rounded-sm">
      <FaSun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <FaMoon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Theme</span>
    </Button>
  );
}
export default ModeButton;
