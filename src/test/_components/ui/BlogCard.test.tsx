import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BlogCard from '@/app/_components/ui/BlogCard';
import { type Blog } from '@prisma/client';

const mockBlog: Blog = {
  id: '1',
  name: 'Test Blog',
  headerImage: '/test.jpg',
  date: new Date('2023-01-01'),
  content: 'This is a test blog content that is long enough to be truncated.',
};

describe('BlogCard component', () => {
  it('renders correctly', () => {
    render(<BlogCard blog={mockBlog} />);
    expect(screen.getByTestId('exhibition-card')).toBeInTheDocument();
  });

  it('displays BlogSkeleton while image is loading', () => {
    render(<BlogCard blog={mockBlog} />);
    expect(screen.getByTestId('blog-skeleton')).toBeInTheDocument();
  });

  it('displays image after loading', () => {
    render(<BlogCard blog={mockBlog} />);
    const image = screen.getByAltText(mockBlog.name);
    act(() => {
      fireEvent.load(image);
    });
    expect(image).toBeInTheDocument();
  });

  it('Link component has the correct href attribute', () => {
    render(<BlogCard blog={mockBlog} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/blogs/${mockBlog.id}`);
  });

  it('Title component displays the correct blog name', () => {
    render(<BlogCard blog={mockBlog} />);
    expect(screen.getByText(mockBlog.name)).toBeInTheDocument();
  });

  it('displays the blog date correctly', () => {
    render(<BlogCard blog={mockBlog} />);
    expect(screen.getByText(mockBlog.date.toDateString())).toBeInTheDocument();
  });

  it('truncates the blog content correctly', () => {
    render(<BlogCard blog={mockBlog} />);
    expect(
      screen.getByText(/This is a test blog content that is long enough to be truncated\.\.\./)
    ).toBeInTheDocument();
  });
});
