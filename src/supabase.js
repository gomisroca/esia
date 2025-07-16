import { createClient } from '@supabase/supabase-js';

import { env } from '@/env';

const supabase = createClient(env.SUPABASE_PROJECT_URL, env.SUPABASE_SERVICE_KEY);

export default supabase;
