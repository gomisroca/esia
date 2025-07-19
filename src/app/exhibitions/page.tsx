import { api } from '@/trpc/server';

import ExhibitionCard from '../_components/ui/ExhibitionCard';

export default async function ExhibitionList() {
  const exhibitions = await api.exhibitions.getAll();

  return (
    <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2" role="list">
      {exhibitions.map((exhibition) => (
        <div key={exhibition.id}>
          <ExhibitionCard exhibition={exhibition} />
        </div>
      ))}
    </div>
  );
}
