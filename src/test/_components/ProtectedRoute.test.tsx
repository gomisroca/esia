import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import { render } from '@testing-library/react';

vi.mock('@/server/auth', () => ({
  getServerAuthSession: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/app/_components/ErrorPage', () => ({
  default: ({ message }: { message: string }) => <div data-testid="error-page">{message}</div>,
}));

vi.mock('@/env', () => ({
  env: {
    ADMIN_ACCOUNTS: 'admin@example.com,admin2@example.com',
  },
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to sign-in when no session exists', async () => {
    vi.mocked(getServerAuthSession).mockResolvedValue(null);

    render(
      await ProtectedRoute({
        children: <div>Protected Content</div>,
      })
    );

    expect(redirect).toHaveBeenCalledWith('/sign-in');
  });

  it('should render an error page when the user is not authorized', async () => {
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
    vi.mocked(getServerAuthSession).mockResolvedValue(mockSession);

    const { findByTestId } = render(
      await ProtectedRoute({
        children: <div>Protected Content</div>,
      })
    );
    expect(await findByTestId('error-page')).toBeTruthy();
  });

  it('should render error page for user not in ADMIN_ACCOUNTS list', async () => {
    const mockSession = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: '123',
        email: 'user@example.com',
        admin: true,
        name: 'Test User',
        image: null,
      },
    };

    vi.mocked(getServerAuthSession).mockResolvedValue(mockSession);

    const { findByTestId } = render(
      await ProtectedRoute({
        children: <div>Protected Content</div>,
      })
    );

    expect(await findByTestId('error-page')).toBeTruthy();
  });

  it('should render error page when user has no email', async () => {
    const mockSession = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: '123',
        email: null,
        admin: true,
        name: 'Test User',
        image: null,
      },
    };

    vi.mocked(getServerAuthSession).mockResolvedValue(mockSession);

    const { findByTestId } = render(
      await ProtectedRoute({
        children: <div>Protected Content</div>,
      })
    );

    expect(await findByTestId('error-page')).toBeTruthy();
  });

  it('should render children for authorized admin user', async () => {
    vi.mocked(getServerAuthSession).mockResolvedValue({
      user: {
        id: '123',
        email: 'admin@example.com',
        admin: true,
        name: 'Test Admin',
        image: null,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    const { findByText } = render(
      await ProtectedRoute({
        children: <div>Protected Content</div>,
      })
    );

    expect(await findByText('Protected Content')).toBeTruthy();
  });
});
