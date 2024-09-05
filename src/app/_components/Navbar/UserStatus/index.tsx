/**
 * Renders the user status component.
 *
 * @example
 * <UserStatus />
 */

import { getServerAuthSession } from '@/server/auth';
import { FaDiscord, FaGoogle, FaKey, FaUser } from 'react-icons/fa6';
import { type Provider } from 'types';
import Dropdown from '../../ui/Dropdown';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import Link from 'next/link';
import Button from '../../ui/Button';

// Providers to display in the dropdown
const providers: Provider[] = [
  {
    name: 'google',
    icon: <FaGoogle className="mr-2 h-5 w-5" />,
  },
  {
    name: 'discord',
    icon: <FaDiscord className="mr-2 h-5 w-5" />,
  },
];

// Sign in dropdown
function SignInDropdown({ providers }: { providers: Provider[] }) {
  return (
    <Dropdown
      button={{
        text: <FaKey className="size-[1.2rem]" />,
        name: 'Sign in',
        className:
          'bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:bg-transparent md:drop-shadow-none rounded-r-none md:rounded-md',
      }}
      className="right-0">
      {providers.map((provider) => (
        <SignInButton key={provider.name} provider={provider} />
      ))}
    </Dropdown>
  );
}

// Profile and settings dropdown when logged in
function SessionDropdown() {
  return (
    <Dropdown
      button={{
        text: <FaUser className="size-[1.2rem]" />,
        name: 'Profile',
        className:
          'bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:bg-transparent md:drop-shadow-none rounded-r-none md:rounded-md',
      }}
      className="right-0">
      <Link href={`/user/favorites`}>
        <Button>Favorites</Button>
      </Link>
      <Link href={`/user/settings`}>
        <Button>Settings</Button>
      </Link>
      <SignOutButton />
    </Dropdown>
  );
}

async function UserStatus() {
  // Get the server-side session
  const session = await getServerAuthSession();

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      {/* Profile and Settings dropdown if the user is logged in */}
      {session && <SessionDropdown />}
      {/* Sign in dropdown if the user is not logged in */}
      {!session && <SignInDropdown providers={providers} />}
    </div>
  );
}

export default UserStatus;
