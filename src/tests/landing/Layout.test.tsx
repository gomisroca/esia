import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import RootLayout from '@/app/layout';

vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('next/font/google', () => ({
  Arimo: vi.fn(() => ({ className: 'mock-arimo' })),
}));

vi.mock('@/trpc/react', () => ({
  TRPCReactProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/app/_components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

describe('RootLayout', () => {
  it('renders layout elements correctly', () => {
    render(
      <RootLayout>
        <div data-testid="child">Test Child</div>
      </RootLayout>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('applies correct HTML attributes', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    expect(container.querySelector('html')).toHaveAttribute('lang', 'en');
  });

  it('sets background image', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    const bgElement = screen.getByRole('main').parentElement;
    expect(bgElement).toHaveStyle({ backgroundImage: "url('/bg.jpg')" });
  });
});
