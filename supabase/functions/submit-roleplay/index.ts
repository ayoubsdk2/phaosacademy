import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Require authenticated caller
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }



  try {
    const {
      learnerName,
      moduleTitle,
      scenarioQuestion,
      idealAnswer,
      response: learnerResponse,
    } = await req.json();
    // Always derive learner email from authenticated user — never trust client input
    const learnerEmail = userData.user.email ?? '';

    if (!learnerResponse || learnerResponse.trim().length < 20) {
      return new Response(JSON.stringify({ error: "Response too short" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.log("No RESEND_API_KEY set. Skipping email send.");
      return new Response(JSON.stringify({ success: true, fallback: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const esc = (s: string) => (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; margin: 0 auto; padding: 32px; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e293b, #1e3a5f); border-radius: 16px; padding: 32px; color: white; margin-bottom: 24px;">
          <h1 style="margin: 0 0 8px; font-size: 22px;">📋 Roleplay Submission</h1>
          <p style="margin: 0 0 4px; opacity: 0.8; font-size: 15px; font-weight: 600;">${esc(moduleTitle)}</p>
          <p style="margin: 0; opacity: 0.6; font-size: 13px;">From: ${esc(learnerName || 'Academy Learner')}${learnerEmail ? ` (${esc(learnerEmail)})` : ''}</p>
        </div>

        <!-- Section 1: The Question -->
        <div style="background: #f1f5f9; border-left: 4px solid #3b82f6; border-radius: 0 12px 12px 0; padding: 20px 24px; margin-bottom: 16px;">
          <p style="margin: 0 0 8px; font-size: 11px; color: #3b82f6; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">1 — The Question Asked</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #1e293b;">${esc(scenarioQuestion) || '<em>No scenario provided</em>'}</p>
        </div>

        <!-- Section 2: Ideal Answer -->
        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 0 12px 12px 0; padding: 20px 24px; margin-bottom: 16px;">
          <p style="margin: 0 0 8px; font-size: 11px; color: #16a34a; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">2 — Ideal Answer (From Training)</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #1e293b;">${esc(idealAnswer) || '<em>No ideal answer configured for this module</em>'}</p>
        </div>

        <!-- Section 3: Student's Response -->
        <div style="background: #fefce8; border-left: 4px solid #eab308; border-radius: 0 12px 12px 0; padding: 20px 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 11px; color: #ca8a04; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">3 — Student's Actual Response</p>
          <div style="margin: 0; font-size: 14px; line-height: 1.7; color: #1e293b; white-space: pre-wrap;">${esc(learnerResponse)}</div>
        </div>

        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">Sent from Referrizer Academy</p>
      </div>
    `;

    // Build recipient list — always send to manager, CC student if email provided
    const toList = ["danlindros20@yahoo.com"];
    const ccList: string[] = [];
    if (learnerEmail && learnerEmail.trim()) {
      ccList.push(learnerEmail.trim());
    }

    const emailPayload: Record<string, unknown> = {
      from: "Referrizer Academy <onboarding@resend.dev>",
      to: toList,
      subject: `Academy Roleplay: ${moduleTitle} — ${learnerName || 'New Submission'}`,
      html: emailHtml,
    };
    if (ccList.length > 0) {
      emailPayload.cc = ccList;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error:", errText);

      // If CC fails (sandbox limitation), retry without CC
      if (ccList.length > 0 && errText.includes("testing emails")) {
        console.log("Retrying without CC (sandbox limitation)...");
        delete emailPayload.cc;
        const retryRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify(emailPayload),
        });
        if (!retryRes.ok) {
          const retryErr = await retryRes.text();
          console.error("Retry also failed:", retryErr);
          return new Response(JSON.stringify({ error: "Email send failed" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ success: true, ccSkipped: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Email send failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
