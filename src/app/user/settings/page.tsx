import ErrorPage from '@/app/_components/ErrorPage';
import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import Image from 'next/image';
import React from 'react';
import SettingsForm from './SettingsForm';

async function UserSettings() {
  try {
    // Get the server-side session, block page if user is not the logged in user, allow setting change otherwise
    const session = await getServerAuthSession();
    if (!session) return <ErrorPage message="Not logged in" />;

    const userInfo = await api.users.getInformation();
    if (!userInfo) return <ErrorPage message="No user found" />;
    return (
      <div className="flex flex-col text-neutral-800 dark:text-neutral-200">
        <div className="flex flex-row justify-center gap-2">
          {userInfo.image && (
            <Image
              src={userInfo.image}
              alt={userInfo.name ? userInfo.name : 'User Image'}
              width={100}
              height={100}
              className="rounded-md border-2 border-neutral-200/20 shadow-md dark:border-neutral-800/20"
            />
          )}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{userInfo.name}</h1>
            <h4>{userInfo.email}</h4>
          </div>
        </div>
        <SettingsForm name={userInfo.name ?? ''} email={userInfo.email ?? ''} />
      </div>
    );
  } catch (_error: unknown) {
    return <ErrorPage message="Something went wrong while fetching your information" />;
  }
}

export default UserSettings;
