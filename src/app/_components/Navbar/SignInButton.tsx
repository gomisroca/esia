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
import Button from '../ui/Button';
import { type Provider } from 'types';

function SignInButton({ provider }: { provider: Provider }) {
  return (
    <Button onClick={() => signIn(provider.name)}>
      {provider.icon}
      <span>{provider.name[0]!.toUpperCase() + provider.name.slice(1)}</span>
    </Button>
  );
}

export default SignInButton;
