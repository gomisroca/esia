import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import ExhibitionButton from '@/app/_components/Navbar/ExhibitionButton';

describe('ExhibitionButton', () => {
  it('renders the button with correct text and styling', () => {
    render(<ExhibitionButton />);
    const link = screen.getByRole('link', { name: /Exhibitions/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass(
      'flex cursor-pointer flex-row items-center justify-center rounded-sm rounded-r-none bg-white/60 p-2 font-bold drop-shadow-md transition-all duration-200 ease-in hover:scale-110 hover:bg-white active:scale-95 active:duration-100 md:rounded-sm dark:bg-black/60 dark:hover:bg-black'
    );
  });

  it('renders a link pointing to "/exhibitions"', () => {
    render(<ExhibitionButton />);
    const link = screen.getByRole('link', { name: /Exhibitions/i });
    expect(link).toHaveAttribute('href', '/exhibitions');
  });
});
