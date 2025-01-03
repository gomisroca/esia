import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import StyleFilter, { FilterDropdown, FilterOffButton } from '@/app/_components/Navbar/StyleFilter';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

// Mock trpc
vi.mock('@/trpc/react', () => ({
  api: {
    styles: {
      getAll: {
        useQuery: vi.fn(),
      },
    },
  },
}));

// Mock react-icons
vi.mock('react-icons/lu', () => ({
  LuFilter: () => <div data-testid="filter-icon">Filter</div>,
  LuFilterX: () => <div data-testid="filter-off-icon">FilterOff</div>,
}));

// Mock scrollToTop utility
vi.mock('@/utils/scrollToTop', () => ({
  default: vi.fn(),
}));

import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/trpc/react';
import scrollToTop from '@/utils/scrollToTop';

describe('StyleFilter', () => {
  const mockPush = vi.fn();
  const mockStyles = [
    { name: 'Modern', count: 10 },
    { name: 'Classic', count: 5 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
    (usePathname as jest.Mock).mockReturnValue('/');
    (api.styles.getAll.useQuery as jest.Mock).mockReturnValue({
      data: mockStyles,
      isLoading: false,
      isFetching: false,
    });
  });

  it('renders skeleton while loading', () => {
    (api.styles.getAll.useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
    });

    render(<StyleFilter />);
    expect(screen.getByTestId('filter-icon')).toBeInTheDocument();
  });

  it('renders filter dropdown when data is loaded', () => {
    render(<StyleFilter />);
    expect(screen.getByRole('button', { name: 'Filter Button' })).toBeInTheDocument();
  });

  it('clears filter when pathname changes to non-style route', () => {
    const { rerender } = render(<StyleFilter />);

    expect(screen.getByRole('button', { name: 'Filter Button' })).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Filter Button' }));
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Modern' }));
    });

    // Change pathname
    (usePathname as jest.Mock).mockReturnValue('/about');
    rerender(<StyleFilter />);

    expect(screen.queryByTestId('filter-off-icon')).not.toBeInTheDocument();
  });
});

describe('FilterDropdown', () => {
  const mockProps = {
    sortedStyles: [
      { name: 'Modern', count: 10 },
      { name: 'Classic', count: 5 },
    ],
    selectedStyle: '',
    setSelectedStyle: vi.fn(),
    handleStyleChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all style options', () => {
    render(<FilterDropdown {...mockProps} />);
    expect(screen.getByRole('button', { name: 'Filter Button' })).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Filter Button' }));
    });
    expect(screen.getByRole('button', { name: 'Modern' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Classic' })).toBeInTheDocument();
  });

  it('calls handlers with correct style on button click', () => {
    render(<FilterDropdown {...mockProps} />);
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Filter Button' }));
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Modern' }));
    });

    expect(mockProps.setSelectedStyle).toHaveBeenCalledWith('Modern');
    expect(mockProps.handleStyleChange).toHaveBeenCalledWith('Modern');
    expect(scrollToTop).toHaveBeenCalledWith('instant');
  });

  it('disables button for selected style', () => {
    render(<FilterDropdown {...mockProps} selectedStyle="Modern" />);
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Filter Button' }));
    });
    expect(screen.getByRole('button', { name: 'Modern' })).toBeDisabled();
  });
});

describe('FilterOffButton', () => {
  const mockHandleClearFilter = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders clear filter button', () => {
    render(<FilterOffButton handleClearFilter={mockHandleClearFilter} />);
    expect(screen.getByRole('button', { name: 'Clear Filter Button' })).toBeInTheDocument();
    expect(screen.getByTestId('filter-off-icon')).toBeInTheDocument();
  });

  it('calls handleClearFilter when clicked', () => {
    render(<FilterOffButton handleClearFilter={mockHandleClearFilter} />);
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Clear Filter Button' }));
    });
    expect(mockHandleClearFilter).toHaveBeenCalled();
  });
});
