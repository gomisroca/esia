'use client';

import { useRouter } from 'next/navigation';
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
  medium: string;
  style: string;
  date: string;
  origin: string;
  image: string;
  artistId: string;
  message: FormMessage | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  medium: '',
  style: '',
  date: '',
  origin: '',
  image: '',
  artistId: '',
  message: null,
};

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Unable to fetch artist details',
  CREATE_ERROR: 'Failed to create artwork. Please try again.',
  IMAGE_UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  IMAGE_UPLOAD_SIZE_ERROR: 'Image size exceeds the limit of 2MB',
  IMAGE_UPLOAD_TYPE_ERROR: 'Please upload a valid image file',
  MISSING_REQUIRED: 'Please fill out all required fields.',
} as const;

export default function ArtworkCreateForm() {
  const router = useRouter();
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const {
    data: artistsData,
    error: fetchError,
    isPending: isArtistsPending,
  } = api.artists.getAll.useQuery({ limit: 100 });

  const createArtwork = api.artworks.create.useMutation({
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        message: { error: true, message: error.message || ERROR_MESSAGES.CREATE_ERROR },
      }));
    },
    onSuccess: async () => {
      await utils.artworks.invalidate();
      setFormState({ ...INITIAL_FORM_STATE, message: { error: false, message: 'Artwork created successfully!' } });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.name || !formState.medium || !formState.style || !formState.date || !formState.origin) {
      setFormState((prev) => ({ ...prev, message: { error: true, message: ERROR_MESSAGES.MISSING_REQUIRED } }));
      return;
    }

    createArtwork.mutate({
      name: formState.name,
      medium: formState.medium,
      style: formState.style,
      date: formState.date,
      origin: formState.origin,
      image: formState.image || undefined,
      artistId: formState.artistId,
    });
  };

  if (isArtistsPending) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-lg">Loading artists...</p>
      </div>
    );
  }

  if (fetchError ?? !artistsData) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>{ERROR_MESSAGES.FETCH_ERROR}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

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
        <p>Medium</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="medium"
          type="text"
          placeholder="Medium"
          onChange={handleChange}
          required
        />
        <p>Style</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="style"
          type="text"
          placeholder="Style"
          onChange={handleChange}
          required
        />
        <p>Date</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="date"
          type="text"
          placeholder="Date"
          onChange={handleChange}
          required
        />
        <p>Origin</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="origin"
          type="text"
          placeholder="Origin"
          onChange={handleChange}
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
        <select
          name="artistId"
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          onChange={(e) => setFormState((prev) => ({ ...prev, artistId: e.target.value }))}>
          <option value="">Select an artist</option>
          {artistsData.items.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={createArtwork.isPending}>
          {createArtwork.isPending ? 'Submitting...' : 'Submit'}
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
