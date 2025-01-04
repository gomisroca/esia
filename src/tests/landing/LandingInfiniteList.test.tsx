import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { api } from '@/trpc/react';
import LandingInfiniteList from '@/app/LandingInfiniteList';

vi.mock('@/trpc/react', () => ({
  api: {
    artworks: {
      getAll: {
        useInfiniteQuery: vi.fn(),
      },
    },
  },
}));

vi.mock('@mantine/hooks', () => ({
  useIntersection: () => ({
    ref: jest.fn(),
    entry: { isIntersecting: true },
  }),
}));

describe('LandingInfiniteList', () => {
  const mockInitialArtworks = {
    nextCursor: '2',
    artworks: [
      {
        id: '1',
        name: 'Artwork 1',
        artistId: '1',
        medium: 'Oil',
        date: '2023-01-01',
        origin: 'Europe',
        image: 'https://example.com/image.jpg',
        style: 'Impressionist',
        artist: { id: '1', name: 'Artist 1', birth: 1890, death: 1940, description: 'Description 2' },
      },
      {
        id: '2',
        name: 'Artwork 2',
        artistId: '2',
        medium: 'Oil',
        date: '2023-01-01',
        origin: 'Europe',
        image: 'https://example.com/image.jpg',
        style: 'Impressionist',
        artist: { id: '2', name: 'Artist 2', birth: 1790, death: 1840, description: 'Description 2' },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial artworks', () => {
    (api.artworks.getAll.useInfiniteQuery as Mock).mockReturnValue({
      data: { pages: [mockInitialArtworks] },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      status: 'success',
    });

    render(<LandingInfiniteList initialArtworks={mockInitialArtworks} />);

    // Check if initial artworks are rendered
    expect(screen.getByText('Artwork 1')).toBeInTheDocument();
    expect(screen.getByText('Artwork 2')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    (api.artworks.getAll.useInfiniteQuery as Mock).mockReturnValue({
      data: undefined,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      status: 'pending',
    });

    render(<LandingInfiniteList initialArtworks={mockInitialArtworks} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    (api.artworks.getAll.useInfiniteQuery as Mock).mockReturnValue({
      data: undefined,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      status: 'error',
    });

    render(<LandingInfiniteList initialArtworks={mockInitialArtworks} />);

    expect(screen.getByText('Error fetching posts')).toBeInTheDocument();
  });

  it('fetches next page when the last artwork intersects', () => {
    const fetchNextPageMock = vi.fn();
    (api.artworks.getAll.useInfiniteQuery as Mock).mockReturnValue({
      data: { pages: [mockInitialArtworks] },
      fetchNextPage: fetchNextPageMock,
      hasNextPage: true,
      isFetchingNextPage: false,
      status: 'success',
    });

    vi.mock('@mantine/hooks', () => ({
      useIntersection: () => ({
        ref: vi.fn(),
        entry: { isIntersecting: true },
      }),
    }));

    render(<LandingInfiniteList initialArtworks={mockInitialArtworks} />);

    expect(fetchNextPageMock).toHaveBeenCalled();
  });

  it('renders "Loading more..." when fetching next page', () => {
    (api.artworks.getAll.useInfiniteQuery as Mock).mockReturnValue({
      data: { pages: [mockInitialArtworks] },
      fetchNextPage: vi.fn(),
      hasNextPage: true,
      isFetchingNextPage: true,
      status: 'success',
    });

    render(<LandingInfiniteList initialArtworks={mockInitialArtworks} />);

    expect(screen.getByText('Loading more...')).toBeInTheDocument();
  });
});
