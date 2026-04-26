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
  content: string;
  date: Date;
  headerImage?: string;
  message: FormMessage | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  content: '',
  date: new Date(),
  headerImage: undefined,
  message: null,
};

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Unable to fetch blog details',
  UPDATE_ERROR: 'Failed to update blog. Please try again.',
  DELETE_ERROR: 'Failed to delete blog. Please try again.',
  IMAGE_UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  IMAGE_UPLOAD_SIZE_ERROR: 'Image size exceeds the limit of 2MB',
  IMAGE_UPLOAD_TYPE_ERROR: 'Please upload a valid image file',
  MISSING_REQUIRED: 'Please fill out all required fields.',
} as const;

export default function BlogUpdateForm({ id }: { id: string }) {
  const router = useRouter();
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const { data: blog, error: fetchError, isPending } = api.blogs.getUnique.useQuery({ id });

  const updateBlog = api.blogs.update.useMutation({
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        message: { error: true, message: error.message || ERROR_MESSAGES.UPDATE_ERROR },
      }));
    },
    onSuccess: async () => {
      await utils.blogs.invalidate();
      setFormState((prev) => ({ ...prev, message: { error: false, message: 'Blog updated successfully!' } }));
    },
  });

  const deleteBlog = api.blogs.delete.useMutation({
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        message: { error: true, message: error.message || ERROR_MESSAGES.DELETE_ERROR },
      }));
    },
    onSuccess: async () => {
      await utils.blogs.invalidate();
      router.back();
    },
  });

  useEffect(() => {
    if (blog) {
      setFormState((prev) => ({
        ...prev,
        name: blog.name,
        content: blog.content,
        date: blog.date,
        headerImage: blog.headerImage ?? undefined,
      }));
    }
  }, [blog]);

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
        setFormState((prev) => ({ ...prev, headerImage: ev.target!.result as string }));
      };
      reader.readAsDataURL(selectedFile);
    } catch {
      setFormState((prev) => ({ ...prev, message: { error: true, message: ERROR_MESSAGES.IMAGE_UPLOAD_ERROR } }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      deleteBlog.mutate({ id });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.name || !formState.content || !formState.date) {
      setFormState((prev) => ({ ...prev, message: { error: true, message: ERROR_MESSAGES.MISSING_REQUIRED } }));
      return;
    }

    updateBlog.mutate({
      id,
      data: {
        name: formState.name,
        content: formState.content,
        date: formState.date,
        headerImage: formState.headerImage,
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-lg">Loading blog details...</p>
      </div>
    );
  }

  if (fetchError || !blog) {
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
        disabled={deleteBlog.isPending}>
        {deleteBlog.isPending ? 'Deleting...' : 'Delete'}
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
        <p>Content</p>
        <textarea
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="content"
          placeholder="Content"
          value={formState.content}
          onChange={handleChange}
          required
        />
        <p>Date</p>
        <input
          className="w-full rounded-sm bg-slate-300 px-4 py-2 dark:bg-slate-700"
          name="date"
          type="date"
          value={formState.date.toISOString().substring(0, 10)}
          onChange={(e) => setFormState((prev) => ({ ...prev, date: new Date(e.target.value) }))}
          required
        />
        {blog.headerImage ? (
          <Image
            unoptimized
            src={blog.headerImage}
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
        <Button type="submit" disabled={updateBlog.isPending}>
          {updateBlog.isPending ? 'Submitting...' : 'Submit'}
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
