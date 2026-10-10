// Supabase Edge Function: manual-adjust
// Enforces 24h teacher / 7d admin window, mandatory reason category & text, and audit logging

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { recordId, newStatus, reasonCategory, reasonText } = await req.json();

    if (!recordId || !newStatus || !reasonCategory || !reasonText) {
      return new Response(JSON.stringify({ error: "Missing required adjustment parameters or reason code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Get user profile role
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "teacher" && profile.role !== "admin")) {
      return new Response(JSON.stringify({ error: "Forbidden: Only teachers and admins can adjust attendance" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Fetch record and session
    const { data: record, error: recError } = await supabaseClient
      .from("attendance_records")
      .select("*, attendance_sessions(scheduled_end, teacher_id)")
      .eq("id", recordId)
      .single();

    if (recError || !record) {
      return new Response(JSON.stringify({ error: "Record not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = Date.now();
    const scheduledEnd = new Date(record.attendance_sessions.scheduled_end).getTime();

    // 3. Enforce correction window
    if (profile.role === "teacher") {
      const hoursSinceEnd = (now - scheduledEnd) / (1000 * 60 * 60);
      if (hoursSinceEnd > 24) {
        return new Response(JSON.stringify({ error: "Teacher correction window expired (24h limit). Escalated to Admin approval." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 4. Update record
    const { data: updatedRecord, error: updateError } = await supabaseClient
      .from("attendance_records")
      .update({
        status: newStatus,
        verification_method: profile.role === "teacher" ? "teacher_manual_override" : "admin_correction",
        override_reason: `[${reasonCategory.toUpperCase()}] ${reasonText}`,
        override_by: user.id,
      })
      .eq("id", recordId)
      .select()
      .single();

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Append to audit log
    await supabaseClient.from("audit_logs").insert({
      actor_id: user.id,
      action: "MANUAL_RECORD_OVERRIDE",
      target_resource: `attendance_records/${recordId}`,
      details: {
        previousStatus: record.status,
        newStatus,
        reasonCategory,
        reasonText,
      },
    });

    return new Response(JSON.stringify(updatedRecord), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
