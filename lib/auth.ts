import { supabase } from "./supabaseClient";
import { User } from "@supabase/supabase-js"; // Import the User type from Supabase

// User authentication functions
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signUp(
  email: string,
  password: string,
  username: string
) {
  // Sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (authError) {
    return { data: null, error: authError };
  }

  // If auth signup was successful, create a record in our users table
  if (authData.user) {
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        username,
        email,
      },
    ]);

    if (profileError) {
      return { data: null, error: profileError };
    }
  }

  return { data: authData, error: null };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  return { data, error };
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  return { data, error };
}

export async function getCurrentUser(): Promise<{ user: User | null; userData: any }> {
  const { data: { user } } = await supabase.auth.getUser();
  
  let userData = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
      
    userData = data;
  }
  
  return { user, userData };
}

export async function getUserProfile() {
  const { user } = await getCurrentUser(); // Destructure to get the user directly

  if (!user) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}