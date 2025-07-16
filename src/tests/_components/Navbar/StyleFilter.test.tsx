import { act, fireEvent, render, screen } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import StyleFilter, { FilterDropdown, FilterOffButton } from '@/app/_components/Navbar/StyleFilter';
import { api } from '@/trpc/react';
import scrollToTop from '@/utils/scrollToTop';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
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

describe('StyleFilter', () => {
  const mockUseRouter = { ...useRouter(), push: vi.fn() };

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue(mockUseRouter);
    vi.mocked(usePathname).mockReturnValue('/');
    vi.mocked(api.styles.getAll.useQuery).mockReturnValue({
      data: [
        { name: 'Casual', count: 10 },
        { name: 'Formal', count: 5 },
      ],
      isLoading: false,
      isFetching: false,
      trpc: { path: 'styles.getAll' },
    } as ReturnType<typeof api.styles.getAll.useQuery>);
    vi.clearAllMocks();
  });

  it('renders the skeleton while loading', () => {
    vi.mocked(api.styles.getAll.useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: false,
      trpc: { path: 'styles.getAll' },
    } as ReturnType<typeof api.styles.getAll.useQuery>);

    render(<StyleFilter />);
    expect(screen.getByRole('button', { name: /Filter Skeleton/i })).toBeInTheDocument();
  });

  it('renders the skeleton while fetching', () => {
    vi.mocked(api.styles.getAll.useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: true,
      trpc: { path: 'styles.getAll' },
    } as ReturnType<typeof api.styles.getAll.useQuery>);

    render(<StyleFilter />);
    expect(screen.getByRole('button', { name: /Filter Skeleton/i })).toBeInTheDocument();
  });

  it('renders nothing when there are no styles', () => {
    vi.mocked(api.styles.getAll.useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      trpc: { path: 'styles.getAll' },
    } as ReturnType<typeof api.styles.getAll.useQuery>);

    render(<StyleFilter />);
    expect(screen.queryByRole('button', { name: /Filter Skeleton/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Filter Off Button/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Filter Dropdown/i })).not.toBeInTheDocument();
  });

  it('renders the filter dropdown when there are styles', () => {
    render(<StyleFilter />);

    expect(screen.queryByRole('button', { name: /Filter Skeleton/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Filter Off Button/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filter Dropdown/i })).toBeInTheDocument();
  });

  it('memoizes and sorts styles by count in descending order', () => {
    vi.mocked(api.styles.getAll.useQuery).mockReturnValue({
      data: [
        { name: 'Casual', count: 10 },
        { name: 'Formal', count: 5 },
        { name: 'Sport', count: 15 },
      ],
      isLoading: false,
      isFetching: false,
      trpc: { path: 'styles.getAll' },
    } as ReturnType<typeof api.styles.getAll.useQuery>);

    render(<StyleFilter />);

    const dropdown = screen.getByRole('button', { name: /Filter Dropdown/i });
    expect(dropdown).toBeInTheDocument();
    act(() => {
      fireEvent.click(dropdown);
    });

    const styleItems = screen.getAllByRole('button');

    expect(styleItems[1]?.textContent).toBe('Sport');
    expect(styleItems[2]?.textContent).toBe('Casual');
    expect(styleItems[3]?.textContent).toBe('Formal');
  });

  it('renders styles and allows selection', () => {
    render(<StyleFilter />);

    const dropdown = screen.getByRole('button', { name: /Filter Dropdown/i });
    expect(dropdown).toBeInTheDocument();
    act(() => {
      fireEvent.click(dropdown);
    });

    expect(screen.getByText('Casual')).toBeInTheDocument();
    expect(screen.getByText('Formal')).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText('Casual'));
    });
    expect(mockUseRouter.push).toHaveBeenCalledWith('/style/casual');
  });

  it('null style removes selected style', async () => {
    render(<StyleFilter />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Filter Dropdown/i }));
    });

    act(() => {
      fireEvent.click(screen.getByText('Casual'));
    });
    expect(mockUseRouter.push).toHaveBeenCalledWith('/style/casual');

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Clear Filter/i }));
    });

    expect(mockUseRouter.push).toHaveBeenCalledWith('/');
  });
});

describe('FilterOffButton', () => {
  const mockUseRouter = { ...useRouter(), push: vi.fn() };

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue(mockUseRouter);
    vi.clearAllMocks();
  });

  it('renders the clear filter button when a style is selected', () => {
    vi.mocked(api.styles.getAll.useQuery).mockReturnValue({
      data: [
        { name: 'Casual', count: 10 },
        { name: 'Formal', count: 5 },
      ],
      isLoading: false,
      isFetching: false,
      trpc: { path: 'styles.getAll' },
    } as ReturnType<typeof api.styles.getAll.useQuery>);

    render(<StyleFilter />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Filter Dropdown/i }));
    });

    act(() => {
      fireEvent.click(screen.getByText('Casual'));
    });

    expect(screen.getByRole('button', { name: /Clear Filter/i }));
  });

  it('clears selected style', () => {
    const handleClearFilter = vi.fn();
    render(<FilterOffButton handleClearFilter={handleClearFilter} />);

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /Clear Filter/i }));
    });

    expect(handleClearFilter).toHaveBeenCalled();
  });
});

describe('FilterDropdown', () => {
  const mockUseRouter = { ...useRouter(), push: vi.fn() };
  const mockStyles = [
    { name: 'Casual', count: 10 },
    { name: 'Formal', count: 5 },
  ];

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue(mockUseRouter);
    vi.mocked(scrollToTop);
    vi.clearAllMocks();
  });

  it('clicking a style updates the selected style and triggers scroll action', () => {
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
