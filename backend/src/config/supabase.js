import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { env } from './env.js';

const { supabaseUrl, supabaseServiceRoleKey } = env;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    transport: ws,
  },
});

export const supabaseConfig = {
  supabaseUrl,
  supabaseServiceRoleKey,
  appEnv: env.nodeEnv,
};
