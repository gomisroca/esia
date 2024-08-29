'use client';

/**
 * Mode button component.
 *
 * @example
 * <ModeButton />
 */

import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa6';

import Button from '../ui/Button';

function ModeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}>
      <FaSun className="size-[1.2rem] rotate-0 scale-100 text-neutral-800 transition-all dark:-rotate-90 dark:scale-0" />
      <FaMoon className="absolute size-[1.2rem] rotate-90 scale-0 text-neutral-200 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Theme</span>
    </Button>
  );
}
export default ModeButton;
