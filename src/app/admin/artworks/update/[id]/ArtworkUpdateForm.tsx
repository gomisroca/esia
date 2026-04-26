'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/app/_components/ui/Button';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';

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

export default function ArtworkUpdateForm({ id }: { id: string }) {
  const router = useRouter();
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const { data: artwork, error: fetchError, isPending } = api.artworks.getUnique.useQuery({ id });
  const {
    data: artistsData,
    error: fetchArtistsError,
    isPending: isArtistsPending,
  } = api.artists.getAll.useQuery({ limit: 100 });

  const updateArtwork = api.artworks.update.useMutation({
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        message: { error: true, message: error.message || ERROR_MESSAGES.UPDATE_ERROR },
      }));
    },
    onSuccess: async () => {
      await utils.artworks.invalidate();
      setFormState((prev) => ({ ...prev, message: { error: false, message: 'Artwork updated successfully!' } }));
    },
  });

  const deleteArtwork = api.artworks.delete.useMutation({
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        message: { error: true, message: error.message || ERROR_MESSAGES.DELETE_ERROR },
      }));
    },
    onSuccess: async () => {
      await utils.artworks.invalidate();
      router.back();
    },
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      deleteArtwork.mutate({ id });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.name || !formState.medium || !formState.style || !formState.date || !formState.origin) {
      setFormState((prev) => ({ ...prev, message: { error: true, message: ERROR_MESSAGES.MISSING_REQUIRED } }));
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
        image: formState.image,
        artistId: formState.artistId,
      },
    });
  };

  if (isPending || isArtistsPending) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-lg">Loading artwork details...</p>
      </div>
    );
  }

  if (fetchError || fetchArtistsError || !artwork || !artistsData) {
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
        disabled={deleteArtwork.isPending}>
        {deleteArtwork.isPending ? 'Deleting...' : 'Delete'}
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
        <p>Medium</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="medium"
          type="text"
          placeholder="Medium"
          value={formState.medium}
          onChange={handleChange}
          required
        />
        <p>Style</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="style"
          type="text"
          placeholder="Style"
          value={formState.style}
          onChange={handleChange}
          required
        />
        <p>Date</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="date"
          type="text"
          placeholder="Date"
          value={formState.date}
          onChange={handleChange}
          required
        />
        <p>Origin</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
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
            src={artwork.image}
            alt={formState.name}
            width={200}
            height={250}
            className="m-auto rounded-sm"
          />
        ) : (
          <p>No image uploaded</p>
        )}
        <p>New Image (optional)</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleImage}
        />
        {artistsData.items.length > 0 && (
          <select
            name="artistId"
            className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
            onChange={(e) => setFormState((prev) => ({ ...prev, artistId: e.target.value }))}
            defaultValue={formState.artistId}>
            <option value="" disabled>
              Select an artist
            </option>
            {artistsData.items.map((artist) => (
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
        <div className="rounded-sm bg-neutral-200 p-4 dark:bg-neutral-800">
          <p className={`text-lg font-bold ${formState.message.error ? 'text-red-500' : 'text-green-500'}`}>
            {formState.message.message}
          </p>
        </div>
      )}
    </div>
  );
}
