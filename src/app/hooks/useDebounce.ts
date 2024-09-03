/**
 * Debounces a value using the useState and useEffect hooks.
 *
 * @param {string} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds.
 *
 * @example
 * const debouncedValue = useDebounce(value, 500);
 */

import { useState, useEffect } from 'react';

export default function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
