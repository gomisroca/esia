'use client';

/**
 * Sign out button component.
 *
 * @example
 * <SignOutButton />
 */

import { signOut } from 'next-auth/react';
import Button from '../../ui/Button';

function SignOutButton() {
  return (
    <Button
      onClick={() => signOut()}
      className="bg-neutral-200/30 drop-shadow-md dark:bg-neutral-800/30 md:bg-transparent md:drop-shadow-none">
      <span>Sign Out</span>
    </Button>
  );
}

export default SignOutButton;
