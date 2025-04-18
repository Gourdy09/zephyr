import { User, AuthError as SupabaseAuthError } from "@supabase/supabase-js";
import { PostgrestError } from "@supabase/supabase-js";

// Define the AuthError type that will be used throughout your auth functions
export type AuthError = {
  message: string;
  status?: number;
  name?: string;
  code?: string;
};

// Return types for auth functions
export type AuthResponse = {
  user: User | null;
  error: AuthError | null;
};

export type UserDataResponse = {
  user: User | null;
  userData: UserProfile | null;
};

export type ResetPasswordResponse = {
  data: any;
  error: AuthError | null;
};

export type UpdatePasswordResponse = {
  data: any;
  error: AuthError | null;
};

export type SignOutResponse = {
  error: AuthError | null;
};

// User profile data type
export type UserProfile = {
  id: string;
  username: string;
  email: string;
  created_at?: string;
  avatar_url?: string | null;
  bio?: string | null;
  // Add any other fields that might be in your users table
};

// Helper function to normalize errors
export function normalizeError(error: unknown): AuthError {
  if (!error) return { message: "Unknown error occurred" };

  // Supabase auth error
  if (typeof error === "object" && error !== null) {
    if ("message" in error) {
      return {
        message: String(error.message),
        ...("code" in error ? { code: String(error.code) } : {}),
        ...("name" in error ? { name: String(error.name) } : {}),
        ...("status" in error ? { status: Number(error.status) } : {}),
      };
    }
  }

  // Convert any other type of error to string
  return { message: String(error) };
}
