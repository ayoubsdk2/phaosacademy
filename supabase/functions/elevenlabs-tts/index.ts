import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Default voice for all academy speech
const DEFAULT_VOICE_ID = "t8Np6Kzi4OFDJT2X3tfD";

// Brand-specific voice overrides (all unified to same voice for now)
const BRAND_VOICE_MAP: Record<string, string> = {};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Require authenticated caller
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }



  try {
    const { text, voice, brand } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'text' parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      return new Response(
        JSON.stringify({ error: "ELEVENLABS_API_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Brand-specific voice takes priority, then fall back to default
    const voiceId = (brand && BRAND_VOICE_MAP[brand]) || DEFAULT_VOICE_ID;

    // Truncate to 5000 chars max per ElevenLabs limit
    const truncatedText = text.slice(0, 5000);

    let response: Response | null = null;
    let lastErrText = "";
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: {
              "xi-api-key": ELEVENLABS_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: truncatedText,
              model_id: "eleven_turbo_v2_5",
              voice_settings: {
                stability: 0.6,
                similarity_boost: 0.75,
                style: 0.3,
                use_speaker_boost: true,
                speed: 1.0,
              },
            }),
          }
        );
        if (response.ok) break;
        lastErrText = await response.text();
        console.error(`ElevenLabs API error (attempt ${attempt}):`, response.status, lastErrText);
        if (response.status === 401 || response.status === 400) break; // not retryable
        if (attempt < 3) await new Promise(r => setTimeout(r, 300 * attempt));
      } catch (fetchErr) {
        lastErrText = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
        console.error(`ElevenLabs fetch failed (attempt ${attempt}):`, lastErrText);
        if (attempt < 3) await new Promise(r => setTimeout(r, 300 * attempt));
        response = null;
      }
    }

    if (!response || !response.ok) {
      const status = response?.status ?? 502;
      if (status === 401) {
        return new Response(
          JSON.stringify({ error: "ElevenLabs authentication failed. Check API key." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "ElevenLabs rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: `ElevenLabs error [${status}]: ${lastErrText}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e) {
    console.error("TTS error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
