import { act, fireEvent, render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ModeButton from '@/app/_components/Navbar/ModeButton';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

vi.mock('react-icons/fa6', () => ({
  FaSun: () => <div data-testid="sun-icon">Sun</div>,
  FaMoon: () => <div data-testid="moon-icon">Moon</div>,
}));

describe('ModeButton', () => {
  const mockSetTheme = vi.fn();

  const mockUseTheme = (resolvedTheme: string) => {
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme,
      setTheme: mockSetTheme,
      themes: [],
      theme: resolvedTheme,
      systemTheme: undefined,
      forcedTheme: undefined,
    } as unknown as ReturnType<typeof useTheme>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    mockUseTheme('light');
    render(<ModeButton />);
    expect(screen.getByRole('button', { name: 'Theme Button' })).toBeInTheDocument();
  });

  it('displays both sun and moon icons', () => {
    mockUseTheme('light');
    render(<ModeButton />);
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('switches from light to dark theme when clicked in light mode', () => {
    mockUseTheme('light');
    render(<ModeButton />);
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Theme Button' }));
    });
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('switches from dark to light theme when clicked in dark mode', () => {
    mockUseTheme('dark');
    render(<ModeButton />);
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Theme Button' }));
    });
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('has correct accessibility label', () => {
    mockUseTheme('light');
    render(<ModeButton />);
    expect(screen.getByText('Theme')).toHaveClass('sr-only');
  });

  it('applies correct className based on theme', () => {
    mockUseTheme('dark');
    render(<ModeButton />);
    expect(screen.getByRole('button', { name: 'Theme Button' })).toHaveClass('rounded-r-none');
  });
});
