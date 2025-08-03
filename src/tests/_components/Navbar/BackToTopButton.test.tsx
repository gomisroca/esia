import '@testing-library/jest-dom';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import BackToTopButton from '@/app/_components/Navbar/BackToTopButton';
import scrollToTop from '@/utils/scrollToTop';

vi.mock('@/utils/scrollToTop', () => ({
  default: vi.fn(),
}));

vi.mock('next/font/google', () => ({
  Limelight: vi.fn(() => ({ className: 'mock-limelight' })),
}));

describe('BackToTopButton', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the button with correct text and styling', () => {
    render(<BackToTopButton />);

    const button = screen.getByRole('button', { name: 'Back to top' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      'flex cursor-pointer flex-row items-center justify-center rounded-sm bg-white/60 p-2 drop-shadow-md transition-all duration-200 ease-in hover:scale-110 hover:bg-white active:scale-95 active:duration-100 dark:bg-black/60 dark:hover:bg-black rounded-l-none px-3 text-2xl font-bold md:rounded-sm mock-limelight pointer-events-auto'
    );
  });

  it('calls scrollToTop with "smooth" when clicked', async () => {
    render(<BackToTopButton />);
    const button = screen.getByRole('button', { name: 'Back to top' });
    act(() => {
      fireEvent.click(button);
    });
    expect(scrollToTop).toHaveBeenCalledWith('smooth');
  });

  it('renders a link pointing to the root ("/")', () => {
    render(<BackToTopButton />);
    const link = screen.getByRole('link', { name: 'Back to top' });

    expect(link).toHaveAttribute('href', '/');
  });
});
