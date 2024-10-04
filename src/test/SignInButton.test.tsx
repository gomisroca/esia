// SignInButton.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { signIn } from 'next-auth/react';
import SignInButton from '../app/sign-in/SignInButton';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

describe('SignInButton component', () => {
  const mockProvider = {
    name: 'google',
    icon: <svg data-testid="provider-icon" />,
  };

  it('renders the provider name correctly', () => {
    render(<SignInButton provider={mockProvider} />);
    expect(screen.getByText('Google')).toBeInTheDocument();
  });

  it('renders the provider icon', () => {
    render(<SignInButton provider={mockProvider} />);
    expect(screen.getByTestId('provider-icon')).toBeInTheDocument();
  });

  it('calls signIn function with the correct provider name when clicked', () => {
    render(<SignInButton provider={mockProvider} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(signIn).toHaveBeenCalledWith('google');
  });
});
