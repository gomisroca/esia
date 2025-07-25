import React from 'react';
import { FaGoogle } from 'react-icons/fa6';
import { type Provider } from 'types';

import { getServerAuthSession } from '@/server/auth';

import Title from '../_components/ui/Title';
import SignInButton from './SignInButton';
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
      <div className="flex flex-col items-center justify-center gap-4">
        <Title>Sign In</Title>
        {providers.map((provider) => (
          <SignInButton key={provider.name} provider={provider} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Title>Signed in as {session.user.email}</Title>
        <SignOutButton />
      </div>
    );
  }
}

export default SignIn;
