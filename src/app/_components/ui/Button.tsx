'use client';

/**
 * A customizable button component.
 *
 * @param {() => void} [onClick] - Optional click event handler.
 * @param {string} [className] - Optional class names for the button.
 * @param {React.ReactNode} children - The content of the button.
 * @param {boolean} [disabled] - Whether the button is disabled.
 * @param {string} [name] - The name of the button.
 * @param {'button' | 'submit' | 'reset'} [type] - The type of button.
 *
 * @example
 * import Button from './Button';
 * const handleClick = () => console.log('Button clicked!');
 * const MyButton = () => (
 *   <Button onClick={handleClick} className="bg-white">Click me!</Button>
 * );
 */

import { twMerge } from 'tailwind-merge';
interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  name?: string;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
  role?: string;
}

function Button({
  children,
  onClick,
  className,
  disabled = false,
  name,
  ariaLabel,
  type = 'button',
  role = 'button',
}: ButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      role={role}
      type={type}
      onClick={onClick}
      name={name ?? ''}
      className={twMerge(
        'flex flex-row items-center justify-center rounded-md p-2 font-bold backdrop-blur-sm transition-all duration-200 hover:bg-neutral-200 active:scale-x-110 active:bg-neutral-300 active:duration-100 dark:hover:bg-neutral-800 active:dark:bg-neutral-700',
        className,
        disabled && 'cursor-not-allowed opacity-50'
      )}
      disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
