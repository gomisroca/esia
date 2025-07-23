import { render, screen } from '@testing-library/react';
import { type ArtworkWithArtist } from 'types';
import { expect } from 'vitest';

import ArtworkList from '@/app/_components/ui/ArtworkList';

describe('ArtworkList component', () => {
  const mockArtworks: ArtworkWithArtist[] = [
    {
      id: '1',
      name: 'Starry Night',
      artistId: 'artist1',
      artist: {
        id: 'artist1',
        birth: 1879,
        death: 1955,
        description:
          'Vincent van Gogh (Dutch, 1853–1890) was a Dutch post-impressionist painter who is widely regarded as one of the most influential and important figures in the history of Western art.',
        name: 'Vincent van Gogh',
      },
      date: '1889',
      origin: 'France',
      medium: 'Oil on canvas',
      style: 'Post-Impressionism',
      image: '/path/to/image.jpg',
    },
    {
      id: '2',
      name: 'Starry Night',
      artistId: 'artist2',
      artist: {
        id: 'artist2',
        birth: 1879,
        death: 1955,
        description:
          'Vincent van Gogh (Dutch, 1853–1890) was a Dutch post-impressionist painter who is widely regarded as one of the most influential and important figures in the history of Western art.',
        name: 'Vincent van Gogh',
      },
      date: '1889',
      origin: 'France',
      medium: 'Oil on canvas',
      style: 'Post-Impressionism',
      image: '/path/to/image.jpg',
    },
  ];

  it('renders correctly', () => {
    render(<ArtworkList artworks={mockArtworks} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('renders the correct number of ArtworkCard components', () => {
    render(<ArtworkList artworks={mockArtworks} />);
    const artworkCards = screen.getAllByTestId('artwork-card');
    expect(artworkCards).toHaveLength(mockArtworks.length);
  });

  it('passes the artistView prop correctly to ArtworkCard components', () => {
    render(<ArtworkList artworks={mockArtworks} artistView={true} />);
    const artworkCards = screen.getAllByTestId('artwork-card');
    artworkCards.forEach((card) => {
      expect(card).toHaveAttribute('data-artist-view', 'true');
    });
  });
});
