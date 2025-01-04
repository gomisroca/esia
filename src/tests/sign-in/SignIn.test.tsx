import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { getServerAuthSession } from '@/server/auth';
import SignIn from '@/app/sign-in/page';

vi.mock('@/server/auth', () => ({
  getServerAuthSession: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

describe('SignIn', () => {
  const mockSession = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    user: {
      id: '123',
      email: 'user@example.com',
      admin: false,
      name: 'Test user',
      image: null,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerAuthSession).mockResolvedValue(mockSession);
  });

  it('renders the sign in provider buttons if no session exists', async () => {
    vi.mocked(getServerAuthSession).mockResolvedValue(null);
    render(await SignIn());
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
  });

  it('renders the sign out button if a session exists', async () => {
    render(await SignIn());
    expect(screen.getByText('Signed in as user@example.com')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });
});
