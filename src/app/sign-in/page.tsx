import React from 'react';
import SignInButton from './SignInButton';
import { type Provider } from 'types';
import { FaGoogle } from 'react-icons/fa6';
import { getServerAuthSession } from '@/server/auth';
import SignOutButton from './SignOutButton';

const providers: Provider[] = [
  {
    name: 'google',
    icon: <FaGoogle className="mr-2 h-5 w-5" />,
  },
];

async function SignIn() {
  const session = await getServerAuthSession();

  if (!session) {
    return (
      <div>
        <h1>Sign In</h1>
        {providers.map((provider) => (
          <SignInButton key={provider.name} provider={provider} />
        ))}
      </div>
    );
  } else {
    return (
      <div>
        <h1>Signed in as {session.user.email}</h1>
        <SignOutButton />
      </div>
    );
  }
}

export default SignIn;
