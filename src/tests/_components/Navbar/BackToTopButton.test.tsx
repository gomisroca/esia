import '@testing-library/jest-dom';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import BackToTopButton from '@/app/_components/Navbar/BackToTopButton';
import scrollToTop from '@/utils/scrollToTop';

vi.mock('@/utils/scrollToTop', () => ({
  default: vi.fn(),
}));

vi.mock('next/font/google', () => ({
  Limelight: () => ({
    variable: '--font-limelight',
    className: 'mock-limelight',
  }),
}));

describe('BackToTopButton', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the button with correct text and styling', () => {
    render(<BackToTopButton />);
    const button = screen.getByRole('button', { name: 'ESIA' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('pointer-events-auto', 'rounded-l-none', 'px-3', 'text-2xl', 'font-bold');
  });

  it('calls scrollToTop with "smooth" when clicked', async () => {
    render(<BackToTopButton />);
    const button = screen.getByRole('button', { name: 'ESIA' });
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
