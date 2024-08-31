/**
 * Root page component.
 */

import { HydrateClient } from '@/trpc/server';
import { ArtworkStyleList } from './_components/ArtworkStyleList';
import Navbar from './_components/Navbar';

export default async function Home() {
  return (
    <HydrateClient>
      <div style={{ backgroundImage: "url('bg.jpg')" }} className="bg-cover bg-fixed bg-center bg-no-repeat">
        <main className="min-h-screen items-center justify-center bg-gradient-to-b from-slate-300/95 via-sky-300/80 to-cyan-300/70 text-white dark:from-slate-900/95 dark:via-sky-900/80 dark:to-cyan-900/70">
          <Navbar />
          <div className="container mx-auto flex min-h-screen w-full flex-col items-center justify-center gap-12 px-4 py-16">
            <ArtworkStyleList />
          </div>
        </main>
      </div>
    </HydrateClient>
  );
}
