import { supabase } from "@/lib/supabase";

async function getFunctionErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "context" in error &&
    error.context &&
    typeof error.context === "object" &&
    "json" in error.context &&
    typeof error.context.json === "function"
  ) {
    try {
      const payload = await error.context.json();

      if (
        payload &&
        typeof payload === "object" &&
        "error" in payload &&
        typeof payload.error === "string"
      ) {
        return payload.error;
      }
    } catch {
      // Fall through to the generic message below.
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Unable to complete this account action right now.";
}

export async function deleteCurrentAccount() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Please sign in again before deleting your account.");
  }

  const { data, error } = await supabase.functions.invoke("delete-account", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    throw new Error(await getFunctionErrorMessage(error));
  }

  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    throw new Error(data.error);
  }

  const { error: signOutError } = await supabase.auth.signOut();

  if (signOutError) {
    console.warn("Account deleted, but local sign-out cleanup failed:", signOutError.message);
  }
}
