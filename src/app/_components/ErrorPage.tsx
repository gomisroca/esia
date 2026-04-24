import Title from './ui/Title';

interface ErrorPageProps {
  message: string;
}

export default function ErrorPage({ message }: ErrorPageProps) {
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 rounded-sm bg-neutral-200/40 p-5 dark:bg-neutral-800/40">
        <Title>ERROR</Title>
        <p className="text-xl font-bold">{message}</p>
      </div>
    </div>
  );
}
