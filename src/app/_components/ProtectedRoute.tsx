import { env } from '@/env';
import { getServerAuthSession } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (
    !session ||
    session.user.admin !== true ||
    !session.user.email ||
    !env.ADMIN_ACCOUNTS.split(',').includes(session.user.email)
  )
    redirect('/sign-in');
  return session ? <>{children}</> : null;
}
