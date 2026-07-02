import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.99.1/cors";

const SUPER_EMAIL = "daniel@referrizer.com";

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Verify caller
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return json({ error: "Unauthorized" }, 401);
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData } = await userClient.auth.getUser();
    const caller = userData?.user;
    if (!caller || (caller.email || "").toLowerCase() !== SUPER_EMAIL) {
      return json({ error: "Forbidden: super-admin only" }, 403);
    }

    const body = await req.json();
    const { action, targetUserId, payload } = body || {};
    if (!action) return json({ error: "Missing action" }, 400);

    // Determine which tables target user uses (JAE vs main)
    const isJae = async (uid: string) => {
      const { data } = await admin.from("jae_cohort_members").select("user_id").eq("user_id", uid).maybeSingle();
      return !!data;
    };

    if (action === "delete_user") {
      if (!targetUserId) return json({ error: "Missing targetUserId" }, 400);
      // Wipe all related data first
      await admin.from("user_progress").delete().eq("user_id", targetUserId);
      await admin.from("jae_user_progress").delete().eq("user_id", targetUserId);
      await admin.from("user_badges").delete().eq("user_id", targetUserId);
      await admin.from("jae_user_profiles").delete().eq("user_id", targetUserId);
      await admin.from("profiles").delete().eq("id", targetUserId);
      await admin.from("user_roles").delete().eq("user_id", targetUserId);
      await admin.from("jae_cohort_members").delete().eq("user_id", targetUserId);
      const { error } = await admin.auth.admin.deleteUser(targetUserId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (action === "reset_progress") {
      if (!targetUserId) return json({ error: "Missing targetUserId" }, 400);
      await admin.from("user_progress").delete().eq("user_id", targetUserId);
      await admin.from("jae_user_progress").delete().eq("user_id", targetUserId);
      await admin.from("user_badges").delete().eq("user_id", targetUserId);
      const reset = {
        total_xp: 0, level: 1, last_completed_day: 0,
        last_completed_module_index: 0, quiz_score_pct: 0,
      };
      await admin.from("profiles").update({ ...reset, tower_best_floor: 0, referriser_lives_used: 0, referriser_time_seconds: 0 }).eq("id", targetUserId);
      await admin.from("jae_user_profiles").update(reset).eq("user_id", targetUserId);
      return json({ success: true });
    }

    if (action === "set_score") {
      // payload: { moduleId, dayId, correct, total }
      const { moduleId, dayId, correct, total } = payload || {};
      if (!targetUserId || !moduleId || dayId == null || correct == null || total == null) {
        return json({ error: "Missing fields" }, 400);
      }
      if (correct < 0 || total <= 0 || correct > total) {
        return json({ error: "Invalid score values" }, 400);
      }
      const score = Math.floor(correct) * 1000 + Math.floor(total);
      const table = (await isJae(targetUserId)) ? "jae_user_progress" : "user_progress";
      // Try update first; if no row, insert
      const { data: existing } = await admin.from(table).select("id").eq("user_id", targetUserId).eq("module_id", moduleId).maybeSingle();
      if (existing) {
        const { error } = await admin.from(table).update({
          score, status: "completed", completed_at: new Date().toISOString(),
        }).eq("id", existing.id);
        if (error) return json({ error: error.message }, 500);
      } else {
        const { error } = await admin.from(table).insert({
          user_id: targetUserId, module_id: moduleId, day_id: dayId,
          score, status: "completed", completed_at: new Date().toISOString(),
        });
        if (error) return json({ error: error.message }, 500);
      }
      return json({ success: true, encoded: score });
    }

    if (action === "set_xp") {
      // payload: { totalXp, level }
      const { totalXp, level } = payload || {};
      if (!targetUserId || totalXp == null) return json({ error: "Missing fields" }, 400);
      const update: any = { total_xp: Math.max(0, Math.floor(totalXp)) };
      if (level != null) update.level = Math.max(1, Math.floor(level));
      const table = (await isJae(targetUserId)) ? "jae_user_profiles" : "profiles";
      const idCol = table === "profiles" ? "id" : "user_id";
      const { error } = await admin.from(table).update(update).eq(idCol, targetUserId);
      if (error) return json({ error: error.message }, 500);
      // Also mirror into the other table if present (keeps leaderboard consistent)
      const otherTable = table === "profiles" ? "jae_user_profiles" : "profiles";
      const otherIdCol = otherTable === "profiles" ? "id" : "user_id";
      await admin.from(otherTable).update(update).eq(otherIdCol, targetUserId);
      return json({ success: true });
    }

    if (action === "delete_module_score") {
      const { moduleId } = payload || {};
      if (!targetUserId || !moduleId) return json({ error: "Missing fields" }, 400);
      await admin.from("user_progress").delete().eq("user_id", targetUserId).eq("module_id", moduleId);
      await admin.from("jae_user_progress").delete().eq("user_id", targetUserId).eq("module_id", moduleId);
      return json({ success: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e: any) {
    return json({ error: e.message || String(e) }, 500);
  }
});
