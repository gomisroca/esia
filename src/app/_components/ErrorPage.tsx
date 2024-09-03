/**
 * Displays an error message to the user.
 *
 * @param {string} message - The error message to display.
 *
 * @example
 * <ErrorPage message="Failed to load artist or artworks" />
 */

import React from 'react';

interface ErrorPageProps {
  message: string;
}

function ErrorPage({ message }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-neutral-200/40 p-5 text-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-200">
      <h1>ERROR</h1>
      <p className="text-xl font-bold">{message}</p>
    </div>
  );
}

export default ErrorPage;
