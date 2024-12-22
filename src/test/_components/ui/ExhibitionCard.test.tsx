import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExhibitionCard from '@/app/_components/ui/ExhibitionCard';
import { type Exhibition } from '@prisma/client';
import '@testing-library/jest-dom';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

const mockExhibition: Exhibition = {
  id: '1',
  name: 'Impressionist Masterpieces',
  image: '/exhibition.jpg',
  start: new Date('2024-01-01'),
  end: new Date('2024-12-31'),
  description: '<p>An amazing collection of impressionist artwork.</p>',
};

describe('ExhibitionCard Component', () => {
  it('renders the skeleton while the image is loading', () => {
    render(<ExhibitionCard exhibition={mockExhibition} />);
    expect(screen.getByTestId('exhibition-skeleton')).toBeInTheDocument();
  });

  it('renders the image and hides the skeleton after loading', async () => {
    render(<ExhibitionCard exhibition={mockExhibition} />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockExhibition.image);

    act(() => {
      fireEvent.load(image);
    });

    await waitFor(() => {
      const skeleton = screen.queryByTestId('exhibition-skeleton');
      expect(skeleton).toBeNull();
    });
  });

  it('renders the exhibition details correctly', () => {
    render(<ExhibitionCard exhibition={mockExhibition} />);
    expect(screen.getByText(mockExhibition.name)).toBeInTheDocument();
    const startString = mockExhibition.start.toDateString();
    const endString = mockExhibition.end.toDateString();
    expect(screen.getByText(`${startString} - ${endString}`)).toBeInTheDocument();
    expect(screen.getByText('An amazing collection of impressionist artwork.')).toBeInTheDocument();
  });

  it('has a link pointing to the correct exhibition page', () => {
    render(<ExhibitionCard exhibition={mockExhibition} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/exhibitions/${mockExhibition.id}`);
  });

  it('renders fallback image when no image is provided', () => {
    const fallbackExhibition = { ...mockExhibition, image: null };
    render(<ExhibitionCard exhibition={fallbackExhibition} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/ph.jpg');
  });
});
