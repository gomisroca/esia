import { render, screen } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { describe, expect, it, type Mock, vi } from 'vitest';

import NavMenu from '@/app/_components/Navbar/NavMenu';
import { api } from '@/trpc/react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

vi.mock('@/trpc/react', () => ({
  api: {
    styles: {
      getAll: {
        useQuery: vi.fn(),
      },
    },
  },
}));

vi.mock('@/app/hooks/useDebounce', () => ({
  default: (value: string) => value,
}));

describe('NavMenu', () => {
  const mockPush = vi.fn();
  const mockStyles = [
    { name: 'Modern', count: 10 },
    { name: 'Classic', count: 5 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockImplementation(() => ({
      push: mockPush,
    }));
    (usePathname as Mock).mockReturnValue('/');
    (api.styles.getAll.useQuery as jest.Mock).mockReturnValue({
      data: mockStyles,
      isLoading: false,
      isFetching: false,
    });
  });

  it('renders the search bar', () => {
    render(<NavMenu />);

    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('renders the filter button', () => {
    render(<NavMenu />);

    expect(screen.getByRole('button', { name: /Filter/i })).toBeInTheDocument();
  });

  it('renders the exhibition button', () => {
    render(<NavMenu />);

    expect(screen.getByRole('link', { name: /Exhibitions/i })).toBeInTheDocument();
  });

  it('renders the blog button', () => {
    render(<NavMenu />);

    expect(screen.getByRole('link', { name: /Blogs/i })).toBeInTheDocument();
  });

  it('renders the theme button', () => {
    render(<NavMenu />);

    expect(screen.getByRole('button', { name: 'Theme Button' })).toBeInTheDocument();
  });

  it('renders the div with the correct class', () => {
    render(<NavMenu />);

    expect(screen.getByRole('navigation')).toHaveClass(
      'pointer-events-auto absolute right-0 top-2 flex flex-col items-center justify-center gap-4 md:right-4 md:top-4'
    );
  });
});
