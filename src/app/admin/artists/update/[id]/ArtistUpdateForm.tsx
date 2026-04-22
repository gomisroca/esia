'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/app/_components/ui/Button';
import { api } from '@/trpc/react';

interface FormMessage {
  error: boolean;
  message: string;
}

interface FormState {
  name: string;
  birth: number;
  death?: number;
  description: string;
  message: FormMessage | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  birth: 0,
  death: undefined,
  description: '',
  message: null,
};

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Unable to fetch artist details',
  UPDATE_ERROR: 'Failed to update artist. Please try again.',
  DELETE_ERROR: 'Failed to delete artist. Please try again.',
  MISSING_REQUIRED: 'Please fill out all required fields.',
} as const;

export default function ArtistUpdateForm({ id }: { id: string }) {
  const router = useRouter();
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const { data: artist, error: fetchError, isPending } = api.artists.getUnique.useQuery({ id });

  const updateArtist = api.artists.update.useMutation({
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        message: { error: true, message: error.message || ERROR_MESSAGES.UPDATE_ERROR },
      }));
    },
    onSuccess: async () => {
      await utils.artists.invalidate();
      setFormState((prev) => ({
        ...prev,
        message: { error: false, message: 'Artist updated successfully!' },
      }));
    },
  });

  const deleteArtist = api.artists.delete.useMutation({
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        message: { error: true, message: error.message || ERROR_MESSAGES.DELETE_ERROR },
      }));
    },
    onSuccess: async () => {
      await utils.artists.invalidate();
      router.back();
    },
  });

  useEffect(() => {
    if (artist) {
      setFormState((prev) => ({
        ...prev,
        name: artist.name,
        description: artist.description ?? '',
        birth: artist.birth ?? 0,
        death: artist.death ?? undefined,
      }));
    }
  }, [artist]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
      deleteArtist.mutate({ id });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.name || !formState.description || !formState.birth) {
      setFormState((prev) => ({
        ...prev,
        message: { error: true, message: ERROR_MESSAGES.MISSING_REQUIRED },
      }));
      return;
    }

    updateArtist.mutate({
      id,
      data: {
        name: formState.name,
        description: formState.description,
        birth: Number(formState.birth),
        death: Number(formState.death) || undefined,
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-lg">Loading artist details...</p>
      </div>
    );
  }

  if (fetchError ?? !artist) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>{ERROR_MESSAGES.FETCH_ERROR}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        className="bg-red-500 px-4 py-2 hover:bg-red-600 xl:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700 xl:dark:bg-red-600"
        onClick={handleDelete}
        disabled={deleteArtist.isPending}>
        {deleteArtist.isPending ? 'Deleting...' : 'Delete'}
      </Button>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <p>Name</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="name"
          type="text"
          placeholder="Name"
          value={formState.name}
          onChange={handleChange}
          required
        />
        <p>Description</p>
        <textarea
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="description"
          placeholder="Description"
          value={formState.description}
          onChange={handleChange}
          required
        />
        <p>Birth</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="birth"
          type="number"
          placeholder="Birth"
          value={formState.birth}
          onChange={handleChange}
          required
        />
        <p>Death</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="death"
          type="number"
          placeholder="Death"
          value={formState.death ?? ''}
          onChange={handleChange}
        />
        <Button type="submit" disabled={updateArtist.isPending}>
          {updateArtist.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
      {formState.message && (
        <div className="rounded-sm bg-neutral-200 p-4 dark:bg-neutral-800">
          <p className={`text-lg font-bold ${formState.message.error ? 'text-red-500' : 'text-green-500'}`}>
            {formState.message.message}
          </p>
        </div>
      )}
    </div>
  );
}
