import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ArtworkCard from '@/app/_components/ui/ArtworkCard';
import { type ArtworkWithArtist } from 'types';

const mockArtwork: ArtworkWithArtist = {
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
};

describe('ArtworkCard component', () => {
  it('renders the artwork image', () => {
    render(<ArtworkCard artwork={mockArtwork} />);
    const img = screen.getByAltText(mockArtwork.name);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining(mockArtwork.image?.split('/').pop() ?? ''));
  });

  it('renders the artwork details correctly in the overlay', () => {
    render(<ArtworkCard artwork={mockArtwork} />);
    fireEvent.mouseOver(screen.getByAltText(mockArtwork.name)); // Simulate hover

    expect(screen.getByText(mockArtwork.name)).toBeInTheDocument();
    expect(screen.getByText(mockArtwork.artist!.name)).toBeInTheDocument();
    expect(screen.getByText(mockArtwork.date!)).toBeInTheDocument();
    expect(screen.getByText(mockArtwork.origin!)).toBeInTheDocument();
    expect(screen.getByText(mockArtwork.medium!)).toBeInTheDocument();
    expect(screen.getByText(mockArtwork.style!)).toBeInTheDocument();
  });

  it('shows placeholder image if image is not provided', () => {
    render(<ArtworkCard artwork={{ ...mockArtwork, image: null }} />);
    const img = screen.getByAltText(mockArtwork.name);
    expect(img).toHaveAttribute('src', expect.stringContaining('ph.jpg'));
  });

  it('shows skeleton while image is loading and hides it after image loads', async () => {
    render(<ArtworkCard artwork={mockArtwork} />);
    const skeleton = screen.getByTestId('artwork-skeleton');
    expect(skeleton).toBeInTheDocument(); // Ensure skeleton is shown initially

    const image = screen.getByAltText(mockArtwork.name);
    fireEvent.load(image); // Simulate image load

    await waitFor(() => {
      expect(skeleton).not.toBeInTheDocument();
    });
  });

  it('applies hover effect on image', () => {
    render(<ArtworkCard artwork={mockArtwork} />);
    const img = screen.getByAltText(mockArtwork.name);
    act(() => {
      fireEvent.mouseOver(img);
    });

    expect(img).toHaveClass('group-hover:scale-110');
  });

  it('flips the card on click', () => {
    render(<ArtworkCard artwork={mockArtwork} />);
    const card = screen.getByTestId('artwork-card');
    act(() => {
      fireEvent.click(card);
    });
    expect(card).toHaveAttribute('data-flipped', 'true');
    act(() => {
      fireEvent.click(card);
    });
    expect(card).toHaveAttribute('data-flipped', 'false');
  });
});
