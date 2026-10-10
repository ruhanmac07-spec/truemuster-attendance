/**
 * TRUEMUSTER — Supabase Client Wrapper
 * Reads publishable credentials from environment.
 * NEVER uses service role or secrets in client applications.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const processEnv = typeof process !== 'undefined' ? process.env : undefined;

const supabaseUrl = metaEnv?.VITE_SUPABASE_URL || processEnv?.VITE_SUPABASE_URL || 'https://tqtsfdmmlaacsvzxbkil.supabase.co';
const supabaseKey = metaEnv?.VITE_SUPABASE_PUBLISHABLE_KEY || metaEnv?.VITE_SUPABASE_ANON_KEY || processEnv?.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_g-I7ylJTuKMiz9HyqTBRKQ_i87hHNzd';

// Ensure WebSocket is defined in Node.js environments (< Node 22)
if (typeof window === 'undefined' && typeof globalThis.WebSocket === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ws = require('ws');
    globalThis.WebSocket = ws;
  } catch {
    // Fallback stub if ws cannot be imported dynamically
    globalThis.WebSocket = class DummyWebSocket {} as any;
  }
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
    detectSessionInUrl: typeof window !== 'undefined',
  },
});

/**
 * Health check & connectivity probe to remote Supabase instance
 */
export async function checkSupabaseConnectivity(): Promise<{ connected: boolean; message: string; latencyMs?: number }> {
  const start = Date.now();
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        apikey: supabaseKey,
      },
    });
    const latency = Date.now() - start;
    if (res.ok) {
      return {
        connected: true,
        message: `Connected to Supabase project (${latency}ms)`,
        latencyMs: latency,
      };
    }
    return {
      connected: false,
      message: `Supabase returned HTTP ${res.status}: ${res.statusText}`,
      latencyMs: latency,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to reach Supabase project: ${err.message}`,
    };
  }
}
