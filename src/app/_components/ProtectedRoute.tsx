import { env } from '@/env';
import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';
import ErrorPage from './ErrorPage';

export default async function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect('/sign-in');
  }
  if (
    session.user.admin !== true ||
    !session.user.email ||
    !env.ADMIN_ACCOUNTS.split(',').includes(session.user.email)
  ) {
    return <ErrorPage message="You are not authorized to access this page" />;
  }
  return session ? <>{children}</> : null;
}
