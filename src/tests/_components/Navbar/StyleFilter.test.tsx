import { act, fireEvent, render, screen } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import StyleFilter, { FilterDropdown, FilterOffButton } from '@/app/_components/Navbar/StyleFilter';
import { api } from '@/trpc/react';
import scrollToTop from '@/utils/scrollToTop';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn().mockReturnValue('/'),
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

vi.mock('@/utils/scrollToTop', () => ({
  default: vi.fn(),
}));

const mockQueryResult = (overrides: object) =>
  ({
    data: undefined,
    isPending: false,
    isFetching: false,
    trpc: { path: 'styles.getAll' },
    ...overrides,
  }) as ReturnType<typeof api.styles.getAll.useQuery>;

describe('StyleFilter', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as ReturnType<typeof useRouter>);
    vi.mocked(usePathname).mockReturnValue('/');
    vi.mocked(api.styles.getAll.useQuery).mockReturnValue(
      mockQueryResult({
        data: [
          { name: 'Casual', count: 10 },
          { name: 'Formal', count: 5 },
        ],
      })
    );
    vi.clearAllMocks();
  });

  it('renders the skeleton while loading', () => {
    vi.mocked(api.styles.getAll.useQuery).mockReturnValue(mockQueryResult({ isPending: true }));
    render(<StyleFilter />);
    expect(screen.getByRole('button', { name: /Filter Skeleton/i })).toBeInTheDocument();
  });

  it('renders nothing when there are no styles', () => {
    vi.mocked(api.styles.getAll.useQuery).mockReturnValue(mockQueryResult({ data: [] }));
    render(<StyleFilter />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the filter dropdown when there are styles', () => {
    render(<StyleFilter />);
    expect(screen.getByRole('button', { name: /Filter Dropdown/i })).toBeInTheDocument();
  });

  it('sorts styles by count in descending order', () => {
    vi.mocked(api.styles.getAll.useQuery).mockReturnValue(
      mockQueryResult({
        data: [
          { name: 'Casual', count: 10 },
          { name: 'Formal', count: 5 },
          { name: 'Sport', count: 15 },
        ],
      })
    );
    render(<StyleFilter />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Filter Dropdown/i }));
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons[1]?.textContent).toBe('Sport');
    expect(buttons[2]?.textContent).toBe('Casual');
    expect(buttons[3]?.textContent).toBe('Formal');
  });

  it('renders styles and allows selection', () => {
    render(<StyleFilter />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Filter Dropdown/i }));
    });
    act(() => {
      fireEvent.click(screen.getByText('Casual'));
    });

    expect(mockPush).toHaveBeenCalledWith('/style/casual');
  });

  it('clears selected style when clear filter is clicked', () => {
    render(<StyleFilter />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Filter Dropdown/i }));
    });
    act(() => {
      fireEvent.click(screen.getByText('Casual'));
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Clear Filter/i }));
    });

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});

describe('FilterOffButton', () => {
  it('calls handleClearFilter when clicked', () => {
    const handleClearFilter = vi.fn();
    render(<FilterOffButton handleClearFilter={handleClearFilter} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Clear Filter/i }));
    });

    expect(handleClearFilter).toHaveBeenCalled();
  });
});

describe('FilterDropdown', () => {
  const mockStyles = [
    { name: 'Casual', count: 10 },
    { name: 'Formal', count: 5 },
  ];

  it('clicking a style updates selection and triggers scroll', () => {
    const setSelectedStyle = vi.fn();
    const handleStyleChange = vi.fn();

    render(
      <FilterDropdown
        sortedStyles={mockStyles}
        selectedStyle="Casual"
        setSelectedStyle={setSelectedStyle}
        handleStyleChange={handleStyleChange}
      />
    );

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Filter Dropdown/i }));
    });
    act(() => {
      fireEvent.click(screen.getByText('Formal'));
    });

    expect(setSelectedStyle).toHaveBeenCalledWith('Formal');
    expect(handleStyleChange).toHaveBeenCalledWith('Formal');
    expect(scrollToTop).toHaveBeenCalledWith('instant');
  });
});
