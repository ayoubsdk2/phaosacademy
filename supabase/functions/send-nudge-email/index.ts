import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.99.1/cors";

const SALES_JOKES = [
  "Why did the salesperson bring a ladder to the meeting? They wanted to reach a higher close rate!",
  "What do you call a sales rep who closes every deal? A myth. But you are getting closer every day!",
  "How many sales reps does it take to change a lightbulb? None, they just keep following up until the bulb changes itself!",
  "A prospect told me 'I will think about it.' So I said, 'Great, I will think about following up every day until you decide!'",
  "Why do sales reps never get lost? Because they always follow the pipeline!",
  "What is the difference between a sales rep and a pizza delivery driver? A pizza delivery driver only has to make one follow-up!",
  "Why was the CRM feeling lonely? Because nobody was logging their activities!",
  "A prospect said 'Money does not grow on trees.' I replied, 'Exactly, that is why you need Referrizer to grow your revenue instead!'",
  "What do you call a prospect who ghosts you? A challenge. What do you call a prospect who comes back? Tuesday.",
  "Why did the AE bring a mirror to the demo? To show the prospect their own growth potential!",
  "Sales tip: If at first you do not succeed, call it a 'learning opportunity' and try again tomorrow.",
  "What is a sales rep's favorite type of music? Anything with a good close!",
];

const ENCOURAGING_MESSAGES = [
  "You are crushing it! Every module you complete brings you one step closer to mastering the art of closing.",
  "Champions are not born, they are trained. Keep pushing through the Academy and you will be unstoppable!",
  "Remember: the top 1% of reps do not have more talent, they have more training hours. You are building that edge right now.",
  "Your dedication to learning sets you apart. Most reps wing it. You are preparing to dominate.",
  "Every great closer started exactly where you are. The difference? They kept going. So keep going!",
  "Think of every module as a new weapon in your sales arsenal. The more you learn, the more dangerous you become.",
  "Success is not about being the best on day one. It is about being better than you were yesterday. Keep it up!",
  "The Academy exists because we believe in your potential. Now prove us right!",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Require authenticated manager
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isManager } = await userClient.rpc("has_role", { _user_id: userData.user.id, _role: "manager" });
    if (!isManager) {
      return new Response(JSON.stringify({ error: "Forbidden: manager only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { userId, name } = await req.json();
    if (!userId || !name) {
      return new Response(JSON.stringify({ error: "Missing userId or name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Get user email from auth
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    const email = authUser?.user?.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "No email found for user" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const esc = (s: string) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const joke = SALES_JOKES[Math.floor(Math.random() * SALES_JOKES.length)];
    const encouragement = ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
    const firstName = esc(String(name).split(" ")[0]);


    // Send via Resend through gateway
    const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">
            <span style="color: #ffffff; background: #1a1a2e; padding: 4px 12px; border-radius: 6px;">Referrizer</span>
            <span style="color: #3b82f6;"> Academy</span>
          </h1>
        </div>
        <h2 style="color: #1a1a2e; font-size: 20px;">Hey ${firstName}! 👋</h2>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">${encouragement}</p>
        <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #1e40af; font-weight: bold; margin: 0 0 8px 0;">😂 Sales Joke of the Day</p>
          <p style="color: #1e40af; margin: 0; font-style: italic;">${joke}</p>
        </div>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Jump back into the Academy and keep building your skills. Your future self will thank you!
        </p>
        <div style="text-align: center; margin-top: 25px;">
          <a href="https://referrizer-academy.lovable.app" style="background: #3b82f6; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Continue Training →</a>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
          Referrizer Academy | Building World-Class Closers
        </p>
      </div>
    `;

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "Referrizer Academy <onboarding@resend.dev>",
        to: [email],
        subject: `${firstName}, keep the momentum going! 🚀`,
        html: htmlContent,
      }),
    });

    const result = await response.json();

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
