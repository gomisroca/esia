import Title from '@/app/_components/ui/Title';
import { api } from '@/trpc/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function ExhibitionSingle({ params }: { params: { id: string } }) {
  const exhibition = await api.exhibitions.getUnique({ id: params.id });
  if (!exhibition) return notFound();
  return (
    <div className="m-auto overflow-hidden rounded-md bg-slate-300/95 dark:bg-slate-900/95">
      <Image
        unoptimized
        src={exhibition.image ?? '/ph.jpg'}
        alt={exhibition.name}
        width={500}
        height={250}
        className="h-full w-full object-cover transition-transform duration-500 ease-in-out"
      />
      <div className="p-4 text-center text-neutral-800 dark:text-neutral-200">
        <Title>{exhibition.name}</Title>
        <p className="font-bold">
          {exhibition.start.toDateString()} - {exhibition.end.toDateString()}
        </p>
        <p dangerouslySetInnerHTML={{ __html: exhibition.description }} />
      </div>
    </div>
  );
}

export default ExhibitionSingle;
