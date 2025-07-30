/**
 * Displays an error message to the user.
 *
 * @param {string} message - The error message to display.
 *
 * @example
 * <ErrorPage message="Failed to load artist or artworks" />
 */

import React from 'react';

import Title from './ui/Title';

interface ErrorPageProps {
  message: string;
}

function ErrorPage({ message }: ErrorPageProps) {
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 rounded-sm bg-neutral-200/40 p-5 dark:bg-neutral-800/40">
        <Title>ERROR</Title>
        <p className="text-xl font-bold">{message}</p>
      </div>
    </div>
  );
}

export default ErrorPage;
