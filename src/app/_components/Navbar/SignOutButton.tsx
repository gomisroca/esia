'use client';

import { signOut } from 'next-auth/react';
import Button from '../ui/Button';

function SignOutButton() {
  return (
    <Button onClick={() => signOut()}>
      <span>Sign Out</span>
    </Button>
  );
}

export default SignOutButton;
