'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/app/_components/ui/Button';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';

interface ExhibitionUpdateFormProps {
  id: string;
}

interface FormMessage {
  error: boolean;
  message: string;
}

interface FormState {
  name: string;
  description: string;
  start: Date;
  end: Date;
  image?: string;
  artistId?: string;
  isSubmitting: boolean;
  isDeleting: boolean;
  message: FormMessage | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  description: '',
  start: new Date(),
  end: new Date(),
  image: undefined,
  isSubmitting: false,
  isDeleting: false,
  message: null,
};

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Unable to fetch exhibition details',
  UPDATE_ERROR: 'Failed to update exhibition. Please try again.',
  DELETE_ERROR: 'Failed to delete exhibition. Please try again.',
  IMAGE_UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  IMAGE_UPLOAD_SIZE_ERROR: 'Image size exceeds the limit of 2MB',
  IMAGE_UPLOAD_TYPE_ERROR: 'Please upload a valid image file',
  MISSING_REQUIRED: 'Please fill out all required fields.',
} as const;

export default function ExhibitionUpdateForm({ id }: ExhibitionUpdateFormProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Query for fetching exhibition details
  const {
    data: exhibition,
    error: fetchError,
    isLoading,
  } = api.exhibitions.getUnique.useQuery(
    { id },
    {
      retry: 2,
      enabled: Boolean(id),
    }
  );

  // Update mutation
  const updateExhibition = api.exhibitions.update.useMutation({
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
          message: error.message || ERROR_MESSAGES.UPDATE_ERROR,
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
          message: 'Exhibition updated successfully!',
        },
      }));
    },
  });

  // Delete mutation
  const deleteExhibition = api.exhibitions.delete.useMutation({
    onMutate: () => {
      setFormState((prev) => ({
        ...prev,
        isDeleting: true,
        message: null,
      }));
    },
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        isDeleting: false,
        message: {
          error: true,
          message: error.message || ERROR_MESSAGES.DELETE_ERROR,
        },
      }));
    },
    onSuccess: async () => {
      await utils.exhibitions.invalidate();
      router.back();
      setFormState((prev) => ({
        ...prev,
        isDeleting: false,
        message: {
          error: false,
          message: 'Exhibition deleted successfully!',
        },
      }));
    },
  });

  // Set initial form data
  useEffect(() => {
    if (exhibition) {
      setFormState((prev) => ({
        ...prev,
        name: exhibition.name,
        description: exhibition.description ?? '',
        start: exhibition.start ?? '',
        end: exhibition.end ?? '',
      }));
    }
  }, [exhibition]);

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this exhibition? This action cannot be undone.')) {
      deleteExhibition.mutate({ id });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.name || !formState.description || !formState.start || !formState.end) {
      setFormState((prev) => ({
        ...prev,
        message: {
          error: true,
          message: ERROR_MESSAGES.MISSING_REQUIRED,
        },
      }));
      return;
    }

    updateExhibition.mutate({
      id,
      data: {
        name: formState.name,
        image: formState.image ?? undefined,
        description: formState.description,
        start: formState.start,
        end: formState.end,
      },
    });
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg">Loading exhibition details...</div>
      </div>
    );
  }
  if (fetchError || !exhibition) {
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
        disabled={formState.isDeleting}>
        {formState.isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <p>Name</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="name"
          type="text"
          placeholder="Name"
          value={formState.name}
          onChange={handleChange}
          required
        />
        <p>Description</p>
        <textarea
          className="w-full rounded-md bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="description"
          placeholder="Description"
          value={formState.description}
          onChange={(e) => setFormState({ ...formState, description: e.target.value })}
          required
        />
        <p>Start Date</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="start"
          type="date"
          placeholder="Start Date"
          value={formState.start.toISOString().substring(0, 10)}
          onChange={(e) => setFormState({ ...formState, start: new Date(e.target.value) })}
          required
        />
        <p>End Date</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="end"
          type="date"
          placeholder="End Date"
          value={formState.end.toISOString().substring(0, 10)}
          onChange={(e) => setFormState({ ...formState, end: new Date(e.target.value) })}
          required
        />
        {exhibition.image ? (
          <Image
            unoptimized
            src={`${exhibition.image}`}
            alt={formState.name}
            width={200}
            height={250}
            className="m-auto rounded-xl"
          />
        ) : (
          <p>No image uploaded</p>
        )}
        <p>New Image (optional)</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => handleImage(e)}
        />
        <Button type="submit" disabled={updateExhibition.isPending}>
          {updateExhibition.isPending ? 'Submitting...' : 'Submit'}
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
