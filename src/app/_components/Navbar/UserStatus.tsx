import { getServerAuthSession } from '@/server/auth';
import Dropdown from '../ui/Dropdown';
import SignOutButton from './SignOutButton';
import SignInButton from './SignInButton';
import { FaDiscord, FaGoogle, FaKey, FaUser } from 'react-icons/fa6';
import { type Provider } from 'types';

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
  const session = await getServerAuthSession();

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      {session && (
        <Dropdown name={<FaUser />} className="right-0">
          <li className="px-4 py-2 hover:bg-neutral-200 hover:dark:bg-neutral-800">Profile</li>
          <li className="px-4 py-2 hover:bg-neutral-200 hover:dark:bg-neutral-800">Settings</li>
          <SignOutButton />
        </Dropdown>
      )}
      {!session && (
        <Dropdown name={<FaKey />} className="right-0">
          {providers.map((provider) => (
            <SignInButton key={provider.name} provider={provider} />
          ))}
        </Dropdown>
      )}
    </div>
  );
}

export default UserStatus;
