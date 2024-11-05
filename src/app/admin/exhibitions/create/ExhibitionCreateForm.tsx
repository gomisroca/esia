'use client';

import Button from '@/app/_components/ui/Button';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';
import { useState } from 'react';

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
  isSubmitting: boolean;
  isDeleting: boolean;
  message: FormMessage | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  start: new Date(),
  end: new Date(),
  image: '',
  description: '',
  isSubmitting: false,
  isDeleting: false,
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

  // Create mutation
  const createExhibition = api.exhibitions.create.useMutation({
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
      await utils.exhibitions.invalidate();
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        message: {
          error: false,
          message: 'Exhibition created successfully!',
        },
      }));
    },
  });

  // Form handlers
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFile = e.target.files![0];

      if (selectedFile) {
        const isValidFileType = checkFileType(selectedFile);
        if (!isValidFileType) {
          setFormState((prev) => ({
            ...prev,
            message: {
              error: true,
              message: ERROR_MESSAGES.IMAGE_UPLOAD_TYPE_ERROR,
            },
          }));
          return;
        }
        const isValidFileSize = checkFileSize(selectedFile);
        if (!isValidFileSize) {
          setFormState((prev) => ({
            ...prev,
            message: {
              error: true,
              message: ERROR_MESSAGES.IMAGE_UPLOAD_SIZE_ERROR,
            },
          }));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target!.result;
          setFormState((prev) => ({ ...prev, image: imageData as string }));
        };
        reader.readAsDataURL(selectedFile);
      }
    } catch (_error) {
      setFormState((prev) => ({
        ...prev,
        message: {
          error: true,
          message: ERROR_MESSAGES.IMAGE_UPLOAD_ERROR,
        },
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.name || !formState.image || !formState.description || !formState.start || !formState.end) {
      setFormState((prev) => ({
        ...prev,
        message: {
          error: true,
          message: ERROR_MESSAGES.MISSING_REQUIRED,
        },
      }));
      return;
    }

    createExhibition.mutate({
      name: formState.name,
      image: formState.image,
      description: formState.description,
      start: formState.start,
      end: formState.end,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <p>Name</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="name"
          type="text"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <p>Description</p>
        <textarea
          className="w-full rounded-md bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="description"
          placeholder="Description"
          onChange={(e) => setFormState({ ...formState, description: e.target.value })}
          required
        />
        <p>Start Date</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="start"
          type="date"
          placeholder="Start Date"
          onChange={(e) => setFormState({ ...formState, start: new Date(e.target.value) })}
          required
        />
        <p>End Date</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="end"
          type="date"
          placeholder="End Date"
          onChange={(e) => setFormState({ ...formState, end: new Date(e.target.value) })}
          required
        />
        <p>Image</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => handleImage(e)}
        />
        <Button type="submit" disabled={createExhibition.isPending}>
          {createExhibition.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
      {formState.message && (
        <div className="rounded-md bg-neutral-200 p-4 dark:bg-neutral-800">
          <p
            className={`${formState.message.error ? 'text-bold text-red-500' : 'text-bold text-green-500'} text-lg font-bold`}>
            {formState.message.message}
          </p>
        </div>
      )}
    </div>
  );
}
