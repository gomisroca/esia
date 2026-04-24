'use client';

import { useState } from 'react';

import Button from '@/app/_components/ui/Button';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';

interface FormMessage {
  error: boolean;
  message: string;
}

interface FormState {
  name: string;
  start: Date;
  end: Date;
  image: string;
  description: string;
  message: FormMessage | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  start: new Date(),
  end: new Date(),
  image: '',
  description: '',
  message: null,
};

const ERROR_MESSAGES = {
  CREATE_ERROR: 'Failed to create exhibition. Please try again.',
  IMAGE_UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  IMAGE_UPLOAD_SIZE_ERROR: 'Image size exceeds the limit of 2MB',
  IMAGE_UPLOAD_TYPE_ERROR: 'Please upload a valid image file',
  MISSING_REQUIRED: 'Please fill out all required fields.',
} as const;

export default function ExhibitionCreateForm() {
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const createExhibition = api.exhibitions.create.useMutation({
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        message: { error: true, message: error.message || ERROR_MESSAGES.CREATE_ERROR },
      }));
    },
    onSuccess: async () => {
      await utils.exhibitions.invalidate();
      setFormState({ ...INITIAL_FORM_STATE, message: { error: false, message: 'Exhibition created successfully!' } });
    },
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      if (!checkFileType(selectedFile)) {
        setFormState((prev) => ({
          ...prev,
          message: { error: true, message: ERROR_MESSAGES.IMAGE_UPLOAD_TYPE_ERROR },
        }));
        return;
      }
      if (!checkFileSize(selectedFile)) {
        setFormState((prev) => ({
          ...prev,
          message: { error: true, message: ERROR_MESSAGES.IMAGE_UPLOAD_SIZE_ERROR },
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormState((prev) => ({ ...prev, image: ev.target!.result as string }));
      };
      reader.readAsDataURL(selectedFile);
    } catch {
      setFormState((prev) => ({ ...prev, message: { error: true, message: ERROR_MESSAGES.IMAGE_UPLOAD_ERROR } }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.name || !formState.description || !formState.start || !formState.end) {
      setFormState((prev) => ({ ...prev, message: { error: true, message: ERROR_MESSAGES.MISSING_REQUIRED } }));
      return;
    }

    if (formState.end <= formState.start) {
      setFormState((prev) => ({ ...prev, message: { error: true, message: 'End date must be after start date.' } }));
      return;
    }

    createExhibition.mutate({
      name: formState.name,
      image: formState.image || undefined,
      description: formState.description,
      start: formState.start,
      end: formState.end,
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
          onChange={handleChange}
          required
        />
        <p>Description</p>
        <textarea
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <p>Start Date</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="start"
          type="date"
          onChange={(e) => setFormState((prev) => ({ ...prev, start: new Date(e.target.value) }))}
          required
        />
        <p>End Date</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="end"
          type="date"
          onChange={(e) => setFormState((prev) => ({ ...prev, end: new Date(e.target.value) }))}
          required
        />
        <p>Image</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleImage}
        />
        <Button type="submit" disabled={createExhibition.isPending}>
          {createExhibition.isPending ? 'Submitting...' : 'Submit'}
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
