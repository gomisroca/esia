// SignOutButton.test.tsx
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SignOutButton from '../app/_components/Navbar/UserStatus/SignOutButton';
import { signOut } from 'next-auth/react';

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

describe('SignOutButton component', () => {
  it('renders the button with the correct text', () => {
    render(<SignOutButton />);
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('calls signOut function when clicked', () => {
    render(<SignOutButton />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(signOut).toHaveBeenCalled();
  });
});
