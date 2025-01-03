import Navbar from '@/app/_components/Navbar';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, type Mock } from 'vitest';

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

vi.mock('@/utils/scrollToTop', () => ({
  default: vi.fn(),
}));

vi.mock('next/font/google', () => ({
  Limelight: vi.fn(() => ({ className: 'mock-limelight' })),
}));

import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/trpc/react';

describe('Navbar', () => {
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

  it('renders the back to top button', async () => {
    render(await Navbar());

    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument();
  });

  it('renders the nav menu', async () => {
    render(await Navbar());

    expect(screen.getByTestId('nav-menu')).toBeInTheDocument();
  });
});
