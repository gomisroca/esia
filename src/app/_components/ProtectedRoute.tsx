import { redirect } from 'next/navigation';

import { env } from '@/env';
import { getServerAuthSession } from '@/server/auth';

import ErrorPage from './ErrorPage';

export default async function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();

  if (!session) redirect('/sign-in');

  const isAuthorized =
    session.user.admin && session.user.email && env.ADMIN_ACCOUNTS.split(',').includes(session.user.email);

  if (!isAuthorized) {
    return <ErrorPage message="You are not authorized to access this page" />;
  }

  return <>{children}</>;
}
