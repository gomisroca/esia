import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import ErrorPage from '@/app/_components/ErrorPage';

describe('ErrorPage', () => {
  it('renders the error title and message', () => {
    const errorMessage = 'Failed to load artist or artworks';

    render(<ErrorPage message={errorMessage} />);

    expect(screen.getByText('ERROR')).toBeInTheDocument();

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('applies the correct layout and styling classes', () => {
    const errorMessage = 'Something went wrong';

    render(<ErrorPage message={errorMessage} />);

    const container = screen.getByText(errorMessage).closest('div');
    expect(container).toHaveClass(
      'flex flex-col items-center justify-center gap-4 rounded-md bg-neutral-200/40 p-5 text-neutral-800 dark:bg-neutral-800/40 dark:text-neutral-200'
    );
  });
});
