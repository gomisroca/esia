import { env } from '@/env';

export const storageUrl = (path: string) => `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/${path}`;
