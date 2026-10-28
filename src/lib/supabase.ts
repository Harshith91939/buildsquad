import { createClient } from '@supabase/supabase-js';
import type { RegisterStudentParams, RegisterStudentResponse, RegistrationPublic } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Strictly use publishable anon key - never service-role key
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * Register student through the existing secure RPC function:
 * register_student(p_name, p_email, p_college, p_year, p_ref, p_channel)
 */
export async function registerStudentRpc(
  params: RegisterStudentParams
): Promise<RegisterStudentResponse> {
  if (!supabase) {
    // If Supabase credentials are not configured, simulate successful registration locally
    console.warn('Supabase credentials not configured in .env. Running in local fallback mode.');
    await new Promise((res) => setTimeout(res, 600));
    
    // Simulate duplicate email detection for testing
    if (params.p_email.toLowerCase().includes('duplicate') || params.p_email.toLowerCase().includes('test-dup')) {
      return {
        ok: false,
        error: 'duplicate',
        message: 'This email is already registered for BuildSquad.',
      };
    }

    const generatedCode = `NXT-${params.p_name.substring(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
    return {
      ok: true,
      own_code: generatedCode,
    };
  }

  try {
    const { data, error } = await supabase.rpc('register_student', {
      p_name: params.p_name,
      p_email: params.p_email,
      p_college: params.p_college,
      p_year: params.p_year,
      p_ref: params.p_ref || null,
      p_channel: params.p_channel || 'direct',
    });

    if (error) {
      console.error('RPC Error executing register_student:', error);
      return {
        ok: false,
        error: error.message,
        message: error.message || 'Registration failed. Please check inputs and try again.',
      };
    }

    // The RPC returns { ok, own_code, error }
    const result = data as RegisterStudentResponse;
    return result;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Network or client error in registerStudentRpc:', error);
    return {
      ok: false,
      error: error.message,
      message: 'Network issue or server unavailable.',
    };
  }
}

/**
 * Fetch registrations publicly through the existing safe read RPC:
 * get_registrations_public() -> created_at, referral_code, source_channel, is_demo
 */
export async function getRegistrationsPublicRpc(): Promise<{
  data: RegistrationPublic[] | null;
  error: string | null;
}> {
  if (!supabase) {
    return { data: null, error: 'SUPABASE_NOT_CONFIGURED' };
  }

  try {
    const { data, error } = await supabase.rpc('get_registrations_public');
    if (error) {
      console.error('RPC Error executing get_registrations_public:', error);
      return { data: null, error: error.message };
    }

    return { data: (data as RegistrationPublic[]) || [], error: null };
  } catch (err: unknown) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}

