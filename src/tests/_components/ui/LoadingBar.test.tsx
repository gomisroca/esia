import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import LoadingBar from '@/app/_components/ui/LoadingBar';

describe('LoadingBar component', () => {
  it('renders the loading bar with the correct text', () => {
    render(<LoadingBar />);
    expect(screen.getByText('LOADING')).toBeInTheDocument();
  });

  it('has the correct container styles', () => {
    render(<LoadingBar />);
    const container = screen.getByText('LOADING');
    expect(container).toHaveClass(
      'fixed bottom-10 left-0 right-0 z-10 mx-auto flex w-1/2 animate-pulse items-center justify-center rounded-md bg-black/40 p-4 text-lg font-bold'
    );
  });

  it('renders a spinning SVG loader icon', () => {
    render(<LoadingBar />);
    const svg = screen.getByTestId('loading-bar-spinner'); // Using { hidden: true } because it's a decorative element
    expect(svg).toHaveClass('animate-spin');
    expect(svg.tagName).toBe('svg');
    expect(svg.querySelector('circle')).toHaveClass('opacity-25');
    expect(svg.querySelector('path')).toHaveClass('opacity-75');
  });

  it('SVG has the correct attributes', () => {
    render(<LoadingBar />);
    const svg = screen.getByTestId('loading-bar-spinner');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveClass('h-5 w-5 text-white');
  });
});
