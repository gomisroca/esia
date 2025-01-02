import { describe, it, expect, vi, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/app/_components/Navbar/SearchBar';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/app/hooks/useDebounce', () => ({
  default: (value: string) => value,
}));

describe('SearchBar', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it('renders input and search icon', () => {
    render(<SearchBar />);

    const button = screen.getByRole('button', { name: 'Search Button' });
    act(() => {
      fireEvent.click(button);
    });
    expect(screen.getByPlaceholderText(/search\.\.\./i)).toBeInTheDocument();
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('updates the input value when typing', () => {
    render(<SearchBar />);

    const button = screen.getByRole('button', { name: 'Search Button' });
    act(() => {
      fireEvent.click(button);
    });

    const input = screen.getByRole('textbox', { name: 'Search Input' });
    act(() => {
      fireEvent.change(input, { target: { value: 'art' } });
      expect(input).toHaveValue('art');
    });
  });

  it('navigates to the correct route after typing and debounce', async () => {
    render(<SearchBar />);

    const button = screen.getByRole('button', { name: 'Search Button' });
    act(() => {
      fireEvent.click(button);
    });

    const input = screen.getByRole('textbox', { name: 'Search Input' });
    act(() => {
      fireEvent.change(input, { target: { value: 'art' } });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/search/art');
    });
  });

  it('navigates to the correct route when pressing Enter', () => {
    render(<SearchBar />);

    const button = screen.getByRole('button', { name: 'Search Button' });
    act(() => {
      fireEvent.click(button);
    });

    const input = screen.getByRole('textbox', { name: 'Search Input' });
    act(() => {
      fireEvent.change(input, { target: { value: 'art' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    expect(mockPush).toHaveBeenCalledWith('/search/art');
  });

  it('clears the input after navigating', async () => {
    render(<SearchBar />);

    const button = screen.getByRole('button', { name: 'Search Button' });
    act(() => {
      fireEvent.click(button);
    });

    const input = screen.getByRole('textbox', { name: 'Search Input' });
    act(() => {
      fireEvent.change(input, { target: { value: 'art' } });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/search/art');
    });
    expect(input).toHaveValue('');
  });

  it('does not navigate for an empty or invalid input', async () => {
    render(<SearchBar />);

    const button = screen.getByRole('button', { name: 'Search Button' });
    act(() => {
      fireEvent.click(button);
    });

    const input = screen.getByRole('textbox', { name: 'Search Input' });
    act(() => {
      fireEvent.change(input, { target: { value: '  ' } });
    });

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
