import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';

import supabase from '@/supabase';

import { storageUrl } from './storageUrl';

async function getToken(id: string, bucket: string) {
  const { data } = await supabase.storage.from(bucket).createSignedUploadUrl(`${id}.png`);
  return data?.token;
}

async function convertBase64ToFile(dataUrl: string, id: string) {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], id + '.png', { type: 'image/png' });
}

export async function uploadImage(image: string, bucket = 'art') {
  const id = uuidv4();
  const file = await convertBase64ToFile(image, id);
  const token = await getToken(id, bucket);

  if (!token) throw new Error('Failed to get upload token');

  const { data } = await supabase.storage.from(bucket).uploadToSignedUrl(`${id}.png`, token, file);

  if (!data) throw new Error('Failed to upload image');

  return data.fullPath as string;
}

export async function resolveImageLink(image: string | undefined, bucket = 'art'): Promise<string | undefined> {
  if (!image) return undefined;
  try {
    const imagePath = await uploadImage(image, bucket);
    if (!imagePath) return undefined;
    return storageUrl(imagePath);
  } catch {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to upload image' });
  }
}
