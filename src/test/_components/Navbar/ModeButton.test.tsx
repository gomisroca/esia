import { render, screen, fireEvent } from '@testing-library/react';
import ModeButton from '@/app/_components/Navbar/ModeButton';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

vi.mock('react-icons/fa6', () => ({
  FaSun: () => <div data-testid="sun-icon">Sun</div>,
  FaMoon: () => <div data-testid="moon-icon">Moon</div>,
}));

import { useTheme } from 'next-themes';

describe('ModeButton', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ModeButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays both sun and moon icons', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ModeButton />);
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('switches from light to dark theme when clicked in light mode', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ModeButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('switches from dark to light theme when clicked in dark mode', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ModeButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('has correct accessibility label', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ModeButton />);
    expect(screen.getByText('Theme')).toHaveClass('sr-only');
  });

  it('applies correct className based on theme', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    const { container } = render(<ModeButton />);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('dark:bg-neutral-800/30');
  });
});
