/**
 * Renders the user status component.
 *
 * @example
 * <UserStatus />
 */

import { getServerAuthSession } from '@/server/auth';
import Dropdown from '../ui/Dropdown';
import SignOutButton from './SignOutButton';
import SignInButton from './SignInButton';
import { FaDiscord, FaGoogle, FaKey, FaUser } from 'react-icons/fa6';
import { type Provider } from 'types';

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

async function UserStatus() {
  // Get the server-side session
  const session = await getServerAuthSession();

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      {/* Profile and Settings dropdown if the user is logged in */}
      {session && (
        <Dropdown
          name={<FaUser />}
          className="right-0"
          btnClassName="bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:bg-transparent md:drop-shadow-none">
          <li className="px-4 py-2 hover:bg-neutral-200 hover:dark:bg-neutral-800">Profile</li>
          <li className="px-4 py-2 hover:bg-neutral-200 hover:dark:bg-neutral-800">Settings</li>
          <SignOutButton />
        </Dropdown>
      )}
      {/* Sign in dropdown if the user is not logged in */}
      {!session && (
        <Dropdown
          name={<FaKey />}
          className="right-0"
          btnClassName="bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:bg-transparent md:drop-shadow-none">
          {providers.map((provider) => (
            <SignInButton key={provider.name} provider={provider} />
          ))}
        </Dropdown>
      )}
    </div>
  );
}

export default UserStatus;
