import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
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

    const button = screen.getByRole('button', { name: /ESIA/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      'rounded-l-none px-2 text-2xl font-bold text-neutral-800 backdrop-blur-sm dark:text-neutral-200 md:rounded-md pointer-events-auto bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:bg-transparent md:drop-shadow-none'
    );
  });

  it('calls scrollToTop with "smooth" when clicked', async () => {
    render(<BackToTopButton />);
    const button = screen.getByRole('button', { name: /ESIA/i });
    act(() => {
      fireEvent.click(button);
    });
    expect(scrollToTop).toHaveBeenCalledWith('smooth');
  });

  it('renders a link pointing to the root ("/")', () => {
    render(<BackToTopButton />);
    const link = screen.getByRole('link', { name: /ESIA/i });

    expect(link).toHaveAttribute('href', '/');
  });
});
