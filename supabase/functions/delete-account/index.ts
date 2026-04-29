import { createClient } from "jsr:@supabase/supabase-js@2";

import { corsHeaders } from "../_shared/cors.ts";

type PostgrestErrorLike = {
  code?: string;
  message?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function isMissingRelationError(error: unknown) {
  return (
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    String((error as PostgrestErrorLike).code) === "42P01"
  );
}

async function cleanupAvatarFiles(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
) {
  const { data: files, error: listError } = await adminClient.storage
    .from("avatars")
    .list(userId, {
      limit: 100,
    });

  if (listError || !files || files.length === 0) {
    if (listError) {
      console.error("Unable to list avatar files during account deletion:", listError);
    }
    return;
  }

  const filePaths = files.map((file) => `${userId}/${file.name}`);
  const { error: removeError } = await adminClient.storage
    .from("avatars")
    .remove(filePaths);

  if (removeError) {
    console.error("Unable to remove avatar files during account deletion:", removeError);
  }
}

async function cleanupTable(
  adminClient: ReturnType<typeof createClient>,
  table: string,
  column: string,
  userId: string,
) {
  const { error } = await adminClient.from(table).delete().eq(column, userId);

  if (error && !isMissingRelationError(error)) {
    throw error;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return jsonResponse(
      { error: "Missing Supabase secrets for the delete-account function." },
      500,
    );
  }

  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return jsonResponse({ error: "Missing authorization header." }, 401);
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return jsonResponse(
      { error: "Please sign in again before deleting your account." },
      401,
    );
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    await cleanupAvatarFiles(adminClient, user.id);
    await cleanupTable(adminClient, "saved_recipes", "user_id", user.id);
    await cleanupTable(adminClient, "meals", "user_id", user.id);
    await cleanupTable(adminClient, "profiles", "id", user.id);

    const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(
      user.id,
      true,
    );

    if (deleteUserError) {
      throw deleteUserError;
    }

    return jsonResponse({ success: true });
  } catch (error) {
    const message =
      error instanceof Error && error.message.trim()
        ? error.message
        : "Unable to delete the account right now.";

    return jsonResponse({ error: message }, 500);
  }
});
