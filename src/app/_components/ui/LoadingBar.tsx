/**
 * Represents a loading bar with a spinner animation
 *
 * @example
 * import LoadingBar from './LoadingBar';
 * {isLoading && <LoadingBar />}
 */

import React from 'react';

function LoadingBar() {
  return (
    <div className="fixed right-0 bottom-10 left-0 z-10 mx-auto flex w-1/2 animate-pulse items-center justify-center rounded-sm bg-black/40 p-4 text-lg font-bold">
      {/* SVG element that acts as a spinning loader icon */}
      <svg
        data-testid="loading-bar-spinner"
        className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
        fill="none"
        viewBox="0 0 24 24">
        {/* Outer circle of the spinner, set to be partially transparent */}
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        {/* Inner path that creates the spinning effect, with a solid color */}
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      LOADING
    </div>
  );
}

export default LoadingBar;
