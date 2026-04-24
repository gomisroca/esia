'use client';

/**
 * Sign in button component.
 *
 * @param {string} provider - The provider to sign in with.
 *
 * @example
 * <SignInButton provider="discord" />
 */

import { signIn } from 'next-auth/react';
import { type Provider } from 'types';

import Button from '../_components/ui/Button';

function SignInButton({ provider }: { provider: Provider }) {
  return (
    <Button
      onClick={() => signIn(provider.name)}
      className="bg-neutral-200/30 drop-shadow-md md:bg-transparent md:drop-shadow-none dark:bg-neutral-800/30">
      {provider.icon}
      <span>{provider.name[0]!.toUpperCase() + provider.name.slice(1)}</span>
    </Button>
  );
}

export default SignInButton;
