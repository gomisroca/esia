'use client';

/**
 * Dropdown component that displays a menu when clicked.
 *
 * @param {{ text: string; className?: string; name?: string }} button - The display in the dropdown button.
 *
 * @param {string} [className] - Optional class names for the dropdown menu.
 * @param {React.ReactNode} children - The content of the dropdown menu.
 * @param {boolean} [closeOnChildClick] - Whether to close the dropdown when a child item is clicked.
 *
 * @example
 * <Dropdown name="Select an option" className="w-56" btnClassName="bg-white">
 *   <li>Option 1</li>
 *   <li>Option 2</li>
 *   <li>Option 3</li>
 * </Dropdown>
 */

import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { twMerge } from 'tailwind-merge';

interface DropdownProps {
  button: {
    text: string | React.ReactNode;
    className?: string;
    name?: string;
  };
  className?: string;
  children: React.ReactNode;
  closeOnChildClick?: boolean;
}

function Dropdown({ button, children, className, closeOnChildClick = true }: DropdownProps) {
  // State variable to track whether the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Reference to the dropdown menu element for click outside detection
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Closes the dropdown if a click occurs outside the menu
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // Closes the dropdown when a child item is clicked
  const handleChildClick = () => {
    setIsOpen(false);
  };

  // Effect to attach and remove a click event listener to the document body
  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      {/* Renders the button with the provided name and onClick event handler */}
      <Button name={button.name} className={button.className ?? undefined} onClick={() => setIsOpen(!isOpen)}>
        {button.text}
      </Button>
      {/* Renders the dropdown menu if isOpen is true */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={twMerge(
            'absolute z-50 mt-2 rounded-md border border-neutral-200/30 drop-shadow-md backdrop-blur-sm dark:border-neutral-800/30',
            className
          )}>
          <ul
            onClick={closeOnChildClick ? handleChildClick : undefined}
            className="flex flex-wrap items-center justify-center gap-2 rounded-md p-2 text-center font-bold text-neutral-800 transition-all duration-200 dark:text-neutral-200">
            {children}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
