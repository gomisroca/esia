import { env } from '@/env';
import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import ErrorPage from './ErrorPage';

export default async function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();

  // First check: No session
  if (!session) {
    redirect('/sign-in');
  } // Second check: Invalid user permissions
  else if (
    !session.user?.admin ||
    !session.user?.email ||
    !env.ADMIN_ACCOUNTS.split(',').includes(session.user.email)
  ) {
    return <ErrorPage message="You are not authorized to access this page" />;
  }

  return <>{children}</>;
}
