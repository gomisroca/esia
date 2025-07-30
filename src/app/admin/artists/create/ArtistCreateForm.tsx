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
  isSubmitting: boolean;
  isDeleting: boolean;
  message: FormMessage | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  birth: 0,
  death: undefined,
  description: '',
  isSubmitting: false,
  isDeleting: false,
  message: null,
};

const ERROR_MESSAGES = {
  CREATE_ERROR: 'Failed to create artist. Please try again.',
  MISSING_REQUIRED: 'Please fill out all required fields.',
} as const;

export default function ArtistCreateForm() {
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Create mutation
  const createArtist = api.artists.create.useMutation({
    onMutate: () => {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: true,
        message: null,
      }));
    },
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        message: {
          error: true,
          message: error.message || ERROR_MESSAGES.CREATE_ERROR,
        },
      }));
    },
    onSuccess: async () => {
      await utils.artworks.invalidate();
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        message: {
          error: false,
          message: 'Artist created successfully!',
        },
      }));
    },
  });

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.name || !formState.birth || !formState.description) {
      setFormState((prev) => ({
        ...prev,
        message: {
          error: true,
          message: ERROR_MESSAGES.MISSING_REQUIRED,
        },
      }));
      return;
    }

    createArtist.mutate({
      name: formState.name,
      birth: Number(formState.birth),
      death: Number(formState.death),
      description: formState.description,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <p>Name</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="name"
          type="text"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <p>Description</p>
        <textarea
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="description"
          placeholder="Description"
          onChange={(e) => setFormState({ ...formState, description: e.target.value })}
          required
        />
        <p>Birth</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="birth"
          type="number"
          placeholder="Birth"
          onChange={handleChange}
          required
        />
        <p>Death</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="death"
          type="number"
          placeholder="Death"
          onChange={handleChange}
        />
        <Button type="submit" disabled={createArtist.isPending}>
          {createArtist.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
      {formState.message && (
        <div className="rounded-sm bg-neutral-200 p-4 dark:bg-neutral-800">
          <p
            className={`${formState.message.error ? 'text-bold text-red-500' : 'text-bold text-green-500'} text-lg font-bold`}>
            {formState.message.message}
          </p>
        </div>
      )}
    </div>
  );
}
