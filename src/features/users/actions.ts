"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { setUserRoleSchema } from "./schema";

export interface SetRoleState {
  error?: string;
  success?: string;
}

export async function setUserRole(
  _prevState: SetRoleState,
  formData: FormData
): Promise<SetRoleState> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak." };
  }

  const parsed = setUserRoleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: "Data tidak valid." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("set_user_role", {
    p_user_id: parsed.data.userId,
    p_new_role: parsed.data.role,
  });

  if (error) {
    return { error: "Gagal menyimpan. Coba lagi." };
  }

  const result = data as { success?: boolean; error?: string } | null;

  if (!result) {
    return { error: "Respons server tidak dikenali." };
  }

  if (result.error) {
    return { error: result.error };
  }

  // Fetch target user's display name for a clearer notification
  let targetName = "User";
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", parsed.data.userId)
      .maybeSingle();

    if (profile?.display_name) {
      targetName = profile.display_name;
    }
  } catch {
    // Ignore; use fallback name
  }

  // In-app notification for admin dashboard
  try {
    await supabase.from("notifications").insert({
      type:
        parsed.data.role === "admin" ? "admin_promoted" : "admin_demoted",
      title:
        parsed.data.role === "admin"
          ? "Admin baru ditambahkan"
          : "Akses admin dicabut",
      body:
        parsed.data.role === "admin"
          ? `${targetName} sekarang punya akses admin.`
          : `${targetName} tidak lagi punya akses admin.`,
      link_url: "/admin/users",
    });
  } catch (notifyErr) {
    console.error("[setUserRole] Failed to create notification:", notifyErr);
  }

  revalidatePath("/admin/users");

  return {
    success:
      parsed.data.role === "admin"
        ? "Berhasil dijadikan admin."
        : "Akses admin dicabut.",
  };
}