import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogButton from '@/app/_components/Navbar/BlogButton';

describe('BlogButton', () => {
  it('renders the button with correct text and styling', () => {
    render(<BlogButton />);
    const link = screen.getByRole('link', { name: /Blogs/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass(
      'flex flex-row items-center justify-center rounded-md rounded-r-none bg-neutral-200/30 p-2 font-bold text-neutral-800 drop-shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-neutral-200 active:scale-x-110 active:bg-neutral-300 active:duration-100 dark:bg-neutral-800/30 dark:text-neutral-200 dark:hover:bg-neutral-800 active:dark:bg-neutral-700 md:rounded-md md:bg-transparent md:drop-shadow-none'
    );
  });

  it('renders a link pointing to "/blogs"', () => {
    render(<BlogButton />);
    const link = screen.getByRole('link', { name: /Blogs/i });
    expect(link).toHaveAttribute('href', '/blogs');
  });
});
