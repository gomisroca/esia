'use client';

import Button from '@/app/_components/ui/Button';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ArtworkUpdateFormProps {
  id: string;
}

interface FormMessage {
  error: boolean;
  message: string;
}

interface FormState {
  name: string;
  medium: string;
  style: string;
  date: string;
  origin: string;
  image?: string;
  artistId?: string;
  isSubmitting: boolean;
  isDeleting: boolean;
  message: FormMessage | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  medium: '',
  style: '',
  date: '',
  origin: '',
  image: undefined,
  artistId: undefined,
  isSubmitting: false,
  isDeleting: false,
  message: null,
};

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Unable to fetch artwork details',
  UPDATE_ERROR: 'Failed to update artwork. Please try again.',
  DELETE_ERROR: 'Failed to delete artwork. Please try again.',
  IMAGE_UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  IMAGE_UPLOAD_SIZE_ERROR: 'Image size exceeds the limit of 2MB',
  IMAGE_UPLOAD_TYPE_ERROR: 'Please upload a valid image file',
  MISSING_REQUIRED: 'Please fill out all required fields.',
} as const;

export default function ArtworkUpdateForm({ id }: ArtworkUpdateFormProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Query for fetching artwork and artist details
  const {
    data: artwork,
    error: fetchError,
    isLoading,
  } = api.artworks.getUnique.useQuery(
    { id },
    {
      retry: 2,
      enabled: Boolean(id),
    }
  );

  const { data: artists, error: fetchArtistsError, isLoading: isArtistsLoading } = api.artists.getAll.useQuery();

  // Update mutation
  const updateArtwork = api.artworks.update.useMutation({
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
      await utils.artworks.invalidate();
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        message: {
          error: false,
          message: 'Artwork updated successfully!',
        },
      }));
    },
  });

  // Delete mutation
  const deleteArtwork = api.artworks.delete.useMutation({
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
      await utils.artworks.invalidate();
      router.back();
      setFormState((prev) => ({
        ...prev,
        isDeleting: false,
        message: {
          error: false,
          message: 'Artwork deleted successfully!',
        },
      }));
    },
  });

  // Set initial form data
  useEffect(() => {
    if (artwork) {
      setFormState((prev) => ({
        ...prev,
        name: artwork.name,
        medium: artwork.medium ?? '',
        style: artwork.style ?? '',
        date: artwork.date ?? '',
        origin: artwork.origin ?? '',
        artistId: artwork.artistId ?? undefined,
      }));
    }
  }, [artwork]);

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
    if (window.confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      deleteArtwork.mutate({ id });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.name || !formState.medium || !formState.style || !formState.date || !formState.origin) {
      setFormState((prev) => ({
        ...prev,
        message: {
          error: true,
          message: ERROR_MESSAGES.MISSING_REQUIRED,
        },
      }));
      return;
    }

    updateArtwork.mutate({
      id,
      data: {
        name: formState.name,
        medium: formState.medium,
        style: formState.style,
        date: formState.date,
        origin: formState.origin,
        image: formState.image ?? undefined,
        artistId: formState.artistId ?? undefined,
      },
    });
  };

  // Loading and error states
  if (isLoading || isArtistsLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg">Loading artwork details...</div>
      </div>
    );
  }
  if (fetchError || fetchArtistsError || !artwork || !artists) {
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
        className="bg-red-500 px-4 py-2 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 xl:bg-red-500 xl:dark:bg-red-600"
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
        <p>Medium</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="medium"
          type="text"
          placeholder="Medium"
          value={formState.medium}
          onChange={handleChange}
          required
        />
        <p>Style</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="style"
          type="text"
          placeholder="Style"
          value={formState.style}
          onChange={handleChange}
          required
        />
        <p>Date</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="date"
          type="text"
          placeholder="Date"
          value={formState.date}
          onChange={handleChange}
          required
        />
        <p>Origin</p>
        <input
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="origin"
          type="text"
          placeholder="Origin"
          value={formState.origin}
          onChange={handleChange}
          required
        />
        {artwork.image ? (
          <Image
            unoptimized
            src={`${artwork.image}`}
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
        {artists && artists.length > 0 && (
          <select
            name="artistId"
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            onChange={(e) => setFormState({ ...formState, artistId: e.target.value })}
            defaultValue={formState.artistId}>
            <option value="" disabled>
              Select an artist
            </option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        )}
        <Button type="submit" disabled={updateArtwork.isPending}>
          {updateArtwork.isPending ? 'Submitting...' : 'Submit'}
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
