'use client';

import { useState } from 'react';

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
  CREATE_ERROR: 'Failed to create artist. Please try again.',
  MISSING_REQUIRED: 'Please fill out all required fields.',
} as const;

export default function ArtistCreateForm() {
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const createArtist = api.artists.create.useMutation({
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        message: { error: true, message: error.message || ERROR_MESSAGES.CREATE_ERROR },
      }));
    },
    onSuccess: async () => {
      await utils.artists.invalidate();
      setFormState({ ...INITIAL_FORM_STATE, message: { error: false, message: 'Artist created successfully!' } });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.name || !formState.birth || !formState.description) {
      setFormState((prev) => ({
        ...prev,
        message: { error: true, message: ERROR_MESSAGES.MISSING_REQUIRED },
      }));
      return;
    }

    createArtist.mutate({
      name: formState.name,
      birth: Number(formState.birth),
      death: Number(formState.death) || undefined,
      description: formState.description,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
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
        <Button type="submit" disabled={createArtist.isPending}>
          {createArtist.isPending ? 'Submitting...' : 'Submit'}
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
