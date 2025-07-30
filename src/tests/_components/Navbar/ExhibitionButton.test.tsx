import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import ExhibitionButton from '@/app/_components/Navbar/ExhibitionButton';

describe('ExhibitionButton', () => {
  it('renders the button with correct text and styling', () => {
    render(<ExhibitionButton />);
    const link = screen.getByRole('link', { name: /Exhibitions/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass(
      'flex flex-row items-center justify-center rounded-sm rounded-r-none bg-neutral-200/30 p-2 font-bold drop-shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-neutral-200 active:scale-x-110 active:bg-neutral-300 active:duration-100 dark:bg-neutral-800/30 dark:hover:bg-neutral-800 active:dark:bg-neutral-700 md:bg-transparent md:drop-shadow-none'
    );
  });

  it('renders a link pointing to "/exhibitions"', () => {
    render(<ExhibitionButton />);
    const link = screen.getByRole('link', { name: /Exhibitions/i });
    expect(link).toHaveAttribute('href', '/exhibitions');
  });
});
