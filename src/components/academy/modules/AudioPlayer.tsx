import { Headphones, Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { CompanyBrand, ExecutiveVoice } from '@/data/academyData';
import { VOICE_CONFIG } from '@/data/academyData';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';

const brandAccent: Record<CompanyBrand, string> = {
  referrizer: 'bg-brand-referrizer/10 text-brand-referrizer',
  wrh: 'bg-brand-wrh/10 text-brand-wrh',
  tc: 'bg-brand-tc/10 text-brand-tc',
  group: 'bg-primary/10 text-primary',
};

const brandBar: Record<CompanyBrand, string> = {
  referrizer: 'bg-brand-referrizer',
  wrh: 'bg-brand-wrh',
  tc: 'bg-brand-tc',
  group: 'bg-primary',
};

const AUDIO_CONTENT_BY_MODULE: Record<string, string> = {
  // Day 4 Phase 1: Mindset & Preparation
  '4-p1-audio': `Let's talk about what you just absorbed, because it's foundational to everything that follows.

You started with Tony Robbins' principle that success is 80% psychology and only 20% skill. That's not a motivational poster, that's a data-backed reality. Harvard research proves that a positive brain is 31% more productive. Before you ever open your mouth on a demo, your mental state has already determined the outcome.

Then you learned the 4 Stages of Competence. Right now, you're moving from Unconscious Incompetence, not knowing what you don't know, into Conscious Incompetence. That transition is uncomfortable. You're suddenly aware of gaps in your game. But that discomfort is the prerequisite to mastery. Stage 4 is Unconscious Competence, executing on reflex, like driving a car. That's where this 10-day program is taking you.

And then we hit the Harvard Written Goal Study. People who wrote down their goals, created action plans, had accountability partners, and sent weekly progress reports achieved 76% more than those who just "thought about it." That's not a small edge, that's a chasm between average and elite. Commanding your subconscious starts somewhere. And that place is in reviewing your goals daily. Only approximately 5% of your brain is conscious, what you think and act upon. The remaining 95% is subconscious. What you immerse yourself in. Stay immersed in your goals, and your why will fuel your subconscious to greatness!

So here's what I need from you: if you haven't already written your top 10 professional goals and sent them to your manager, do it today. Not tomorrow. Today. Written goals with accountability are the single highest predictor of success in sales. Your mindset is your foundation, bulletproof it, and everything else gets easier.`,

  // Day 4 Phase 2: The Opening
  '4-p2-audio': `What you just learned in Phase 2 is arguably the most critical 5 minutes of any sales conversation, the Opening.

Here's what separates amateurs from closers: amateurs rush straight into the product demo. They can't wait to show features. And the prospect mentally checks out in 90 seconds because they've seen that movie before from fifteen other vendors.

You learned to do the opposite. Step one: establish the decision maker immediately. The Golden Question, "Other than yourself, is there anyone else involved in choosing new marketing programs?", this must be asked within the first several minutes. If you're pitching to someone who can't say yes, you're performing, not selling.

Now let's talk about SPICE, Specificity, Personalization, Insight, Curiosity, and Empathy. This is one of many advanced frameworks you should be internalizing. Sales mastery isn't about memorizing one method, it's about layering multiple methodologies into your muscle memory until they fire automatically. NIMTC, SPICE, the Challenger model, these aren't just theories or great talking points. They only matter when you internalize them so deeply that they show up in real conversations without you thinking about them. That's the difference between knowing frameworks and living them.

There's a reason why we were given one mouth and two ears: Deep Listening. You're not just hearing words, you're listening for personal crises, frustration with current vendors, emotional undercurrents. When a business owner says "I'm just tired of doing everything myself," that's not a feature request. That's a cry for help. And that emotional truth is what you'll connect to when you close.

The opening should last several minutes of real conversation. If you're jumping into the product in under three minutes, you're doing it wrong. Slow down, listen deeply, and qualify thoroughly. The close starts in the opening. To open strong is to close strong. ABC, always be closing.`,

  // Day 4 Phase 3: The Discovery
  '4-p3-audio': `Phase 3 just armed you with one of the most powerful concepts in modern sales, Pain equals Profit.

You learned that without uncovering real pain, you're a commodity. You're competing on price against every other marketing platform out there. But with pain, genuine, emotional, specific pain, you're a consultant delivering transformation. That distinction is worth tens of thousands of dollars in commission over your career.

The Challenger Sale methodology you just studied has three pillars: Teach, Tailor, Take Control. The best Account Executives don't just passively listen, they teach prospects something new about their own business. When a prospect says "We're on page 2 of Google," a mediocre rep says "We can fix that." A Challenger rep reframes it as a Competitor Subsidy, every day you're on page 2, you're literally funding your competitors' growth on page 1. That's not a ranking problem. That's a revenue leak.

And then we went deep on emotional root discovery. Surface-level answers like "We need more leads" are just the tip of the iceberg. Your job is to keep asking Why. What happens if you don't get more leads? How does that affect your family? Your stress level? Your plans to open a second location?

When you reach the emotional root, that's where the magic happens. Pain qualifies the lead. Pain enables your solution. Healing pain creates loyalty. And understanding pain reduces churn. If you only hear surface-level issues, you become replaceable. Go deeper than anyone else, and you become indispensable.`,

  // Day 4 Phase 4: The Body (Inverted Pyramid)
  '4-p4-audio': `Phase 4 just changed how you'll demo Referrizer forever, because most reps demo completely wrong.

Never give a button-clicking feature tour. A shotgun demo, where you simply cover every single product and feature hoping something will resonate, is the fastest way to lose a prospect's attention. Be a sniper, and aim to kill. Don't throw spaghetti at the wall and hope some of it sticks. Learn how to present in the body what you discover in the opening. Lead with outcome, not process. Show the biggest value first.

You studied the four Referrizer packages, and you need to know them cold.

What's the difference between Premium and Premium PLUS? Then Reputation only? This is a high level overview, as there are nuances regarding the monthly text credit allowances, overage usage charges, email usage rates and more. Spend some time reviewing and memorizing the pricing structures so it becomes second nature.

Trial Close examples like "Do you want to run the campaigns yourself, or would you prefer us to handle it?" these aren't closing questions, they're temperature checks. They tell you where the prospect's head is at. If they're answering positively, you're on track. If they hesitate, or act like a lump on a log, you've got more work to do.

Lead with outcome. Keep bringing up ROI and resolving pain. Provide a vision for healing, getting their business whole, growing, driving and thriving. And the close becomes that much easier.`,

  // Day 4 Phase 5: Handling Objections
  '4-p5-audio': `Phase 5 just gave you your objection-handling superpower, the 6-Step Reflex.

Here's what ninety-nine percent of reps do when they hear an objection: they fold. They panic. They start offering discounts. They apologize for the price. And the prospect smells blood in the water.

You're going to do the opposite. You're going to lean in.

First, you learned the critical distinction between Smokescreens and Conditions. A smokescreen, "not interested," "too busy," "send me an email", is a reflex, not a real objection. A condition, bankruptcy, genuine disqualification, is a hard stop. Your job is determining which is which, because they require completely different responses.

Then you drilled the 6-Step Reflex until it becomes muscle memory: Hear them out, actually listen, don't prepare your rebuttal. Rephrase it, prove you heard them. Isolate it, "Other than this, is there anything else preventing us from moving forward?" Handle it, value justification, testimonial, risk reversal. Confirm, "Does that address your concern?" And Roll On, transition immediately back to the close.

And remember: when they say they can't afford it, reframe with ROI. If the system brings in just ONE new customer per month, and average clients see fifteen to twenty, that one customer alone pays for the entire platform many times over. This isn't an expense, it's an investment with measurable returns.

When they say "I don't have the budget," they're really saying "I don't trust this will work." Don't negotiate on price. Increase the proof.`,

  // Day 4 Phase 6: The Close & Vision
  '4-p6-audio': `Phase 6. This is where everything comes together. This is The Close.

You just learned how to bring it all home, and it's not about pressure tactics or manipulation. It's about connecting every thread from the entire conversation into one powerful moment of clarity.

You studied the Value Summary, taking their pain from the opening, their qualification from discovery, and connecting it directly to the specific Referrizer package that solves their problem. This isn't a generic pitch. This is a personalized vision of their business 90 days from now.

The Ben Franklin Close, the T-chart with Yes reasons on the left and No reasons on the right, works because when you've done proper discovery, the Yes column always dominates. You're not creating reasons to buy. You're simply organizing the reasons they've already given you throughout the conversation.

And then there's the 45-minute rule. A demo should never exceed 45 minutes unless you are actively closing the deal. Respect their time, and they'll respect your recommendation.

But the real magic is in creating the vision. Paint the picture: "You told me you're working 60-hour weeks and still manually texting customers. With the Premium PLUS plan, every single one of those follow-ups happens automatically. In 90 days, you'll have 40-plus new Google reviews, a loyalty program running on autopilot, and a referral engine generating new customers while you sleep."

Create urgency by connecting time to money. Every day they wait is another day of manual work and lost revenue. The question isn't whether they can afford Referrizer, it's whether they can afford NOT to have it.`,

  // Day 4 Summary
  '4-summary': `WHAT. A. DAY. Let's zoom out and appreciate what you just accomplished, because Day 4 was an ABSOLUTE MASTERCLASS in the complete sales process. You should be FIRED UP right now!

You covered six intensive phases. Phase 1 was Mindset and Preparation, the 4 Stages of Competence, the Harvard Goal Study, and the science-backed reality that a positive brain outperforms a negative one by 31%. Your psychology determines your paycheck.

Phase 2 was The Opening, establishing the decision maker with the Golden Question, proper qualification, and the cardinal sin of jumping into the product too early. The opening should last several minutes of genuine human conversation.

Phase 3 was The Discovery, the Challenger Sale methodology of Teach, Tailor, Take Control. Pain equals Profit. Surface-level answers are starting points, not endpoints. You dig for the emotional root.

Phase 4 was The Body, focus on Referrizer core packages, solution linked to qualification and pain. Accumulating Little Yeses with FABs, Tie-Downs, and Trial Closes.

Phase 5 was Handling Objections, and THIS is where champions separate themselves from average reps. You learned the critical difference between Smokescreens and Conditions.

And Phase 6 was The Close and Vision, the Value Summary connecting their pain from discovery directly to the specific Referrizer package that solves their problem. The Ben Franklin Close works because when you've done proper discovery, the Yes column ALWAYS dominates. Respect the 45-minute rule. And then, the REAL magic, you paint the vision: their business 90 days from now, reviews flooding in, loyalty program running on autopilot, referrals generating new customers while they sleep. Every day they wait is another day of lost revenue. The question isn't whether they can afford Referrizer, it's whether they can afford NOT to have it.

You now have a COMPLETE, REPEATABLE sales framework from hello to signed contract. Six phases. One unstoppable system.

NOW your FINAL EXAM is NEXT. It pulls from ALL SIX PHASES. Everything you studied today comes together RIGHT NOW. This is YOUR moment. Trust your preparation, bring that energy, and CRUSH IT! LET'S GOOO!`,


  // Day 5 Phase 1: Objection Psychology, synthesizes reading + coach chat
  '5-p1-audio': `Let's talk about what you just absorbed, because it rewires everything you thought you knew about objections.

You started by learning that objections aren't rejection, they're buying signals. Research across 67,000+ sales calls proves it: deals with objections close at HIGHER rates than deals without them. Read that again. When a prospect pushes back, it means they're engaged. They're thinking. They're imagining themselves using the product. The worst thing a prospect can say isn't "no", it's nothing at all.

Then you classified every objection into five categories: Smokescreens, Obstacles, Serious Concerns, Clarifying Questions, and Conditions. This matters because each type requires a completely different response. A smokescreen like "not interested" needs pattern interruption. A serious concern like "we tried marketing software before and got burned" needs empathy and proof. A condition like "we're closing next month" is a hard stop, walk away gracefully.

And then in your coach chat, you confronted your own gut reaction to objections. Most reps admitted their instinct is to freeze, defend, or discount. That's the reptilian brain taking over, fight or flight. Top one percent reps have trained themselves to feel a rush of EXCITEMENT when they hear an objection, because they know it means the prospect is close.

Here's your takeaway: from this moment forward, every objection is a gift. It's the prospect telling you EXACTLY what they need to hear before they say yes. Your job isn't to overcome objections, it's to welcome them, decode them, and use them as the bridge to the close.`,

  // Day 5 Phase 2: The 6-Step Framework, synthesizes reading + coach chat
  '5-p2-audio': `Phase 2 just gave you the most important muscle memory you'll develop in your entire sales career, the 6-Step Reflex.

In the reading, you dissected each step with surgical precision. Hear them out, and I mean REALLY hear them, not just wait for your turn to talk. Rephrase, prove you were listening by feeding their words back. Isolate, "Other than this, is there anything else?" This is the step most reps skip, and it's the step that prevents you from playing whack-a-mole with endless objections. Handle, now and ONLY now do you address the concern with value, proof, or reframe. Confirm, "Does that make sense?" And Roll On, immediately transition back to the conversation. No awkward pauses. No celebration. Just smooth momentum.

Then in your coach chat, you walked through this framework LIVE against Marco's "We tried something like this before and it didn't work." That's one of the hardest objections in sales because it's loaded with emotional baggage, a past failure, wasted money, broken trust. And you had to resist every urge to say "but we're different!" because that's what every other vendor says.

Instead, the framework forced you to acknowledge the pain first, isolate whether it's the concept they're against or just the execution of the last vendor, and THEN position Referrizer as the solution to the specific failure they experienced.

Here's what makes this framework unstoppable: it works on EVERY objection. Price, timing, competition, authority, "not interested", the 6 steps handle them all. The framework is the constant. Only the handle step changes based on the objection type. Drill this until it's reflex. Until you don't think about it. Until it fires automatically like breathing.`,

  // Day 5 Phase 3: Price & Budget, synthesizes reading + coach chat
  '5-p3-audio': `Phase 3 just destroyed the number one fear of every sales rep on the planet, the price objection. And it did it with DATA, not theory.

You learned that Research shows top-performing reps pause FIVE TIMES LONGER after a price objection than average reps. Five times. While mediocre reps rush to defend or discount, elite closers create space. That pause communicates confidence. It says "I'm not afraid of this conversation."

Then you studied Sandler Bracketing, the technique of narrowing budget without confrontation. Instead of asking "what's your budget?" which puts people on the defensive, you bracket: "Most businesses like yours invest between two hundred and five hundred a month in marketing automation. Where do you typically fall in that range?" Now they're giving you a number without feeling interrogated.

And the big insight from Gap Selling that ties everything together: most price objections are actually DISCOVERY FAILURES. If a prospect says "that's too expensive," what they're really saying is "you haven't shown me enough value to justify the cost." The problem isn't the price, it's the gap between their current pain and the future state you've painted. If that gap is massive, price becomes irrelevant.

In your coach chat with Jake the gym owner, you practiced the ROI reframe without offering a discount. Two ninety-nine a month divided by thirty days is ten dollars a day. One new member is worth six hundred dollars or more in annual revenue. If Referrizer brings just ONE new member per month, and the average gym sees twelve to fifteen, that single member pays for the platform twice over. You're not spending two ninety-nine. You're investing ten dollars a day to generate six hundred dollars in return. That's not an expense line. That's a profit center.

Never negotiate on price. Increase the proof. Widen the gap. Make the investment look small compared to the cost of doing nothing.`,

  // Day 5 Phase 4: Competitive & Timing, synthesizes reading + coach chat
  '5-p4-audio': `Phase 4 just armed you with something most reps never develop, confidence against competitors and stalls.

Here's what makes "We already use Podium" or "We're with Birdeye" actually the EASIEST objection to handle: it means they already believe in the category. They've already committed budget to marketing automation. They've already felt the pain that drives them to seek solutions. You're not selling them on the concept, you're selling them on a better execution.

The Challenger Reframe technique you studied is devastatingly effective. Instead of bashing competitors, which makes you look desperate, you ask one surgical question that exposes the gap in their current solution. "That's great you're investing in reputation management, are they also handling your loyalty program, automated campaigns, referral engine, and lead capture all in one system?" The answer is always no. Because nobody else does what Referrizer does as a complete ecosystem.

Timing objections, "not the right time," "maybe next quarter," "we're in our slow season", these are smokescreens ninety percent of the time. The Challenger approach reframes timing as cost: "I understand timing is important. Let me ask you this, what's it costing you every month you wait? If you're losing five customers a month to the competition down the street, that's potentially thirty thousand in annual revenue walking out your door. Is next quarter really the right time to start recovering that?"

And authority objections, "I need to talk to my partner", you learned to prevent these entirely in the opening. The Golden Question from Day 4: "Other than yourself, is there anyone else involved in choosing new marketing programs?" If they say yes, you get that person on the call. Period.

In your coach chat, you handled the Birdeye objection live without bashing the competitor. That restraint is what separates consultants from vendors. You acknowledged their investment, asked what gaps exist, and positioned Referrizer as the complement that completes their marketing stack. Beautiful.`,

  // Day 5 Phase 5: Smokescreens & Gatekeepers, synthesizes reading + coach chat
  '5-p5-audio': `Phase 5 just taught you how to walk through walls. Because that's essentially what gatekeeper mastery and smokescreen handling IS, getting past barriers that stop ninety-nine percent of reps cold.

You learned the three most common cold-call denials: "Not interested." "Not in the market." "Not in the budget." And here's the crucial insight, ALL THREE are smokescreens. They're reflexive responses designed to get salespeople off the phone as quickly as possible. The prospect hasn't heard your pitch. They haven't seen your product. They literally CANNOT make an informed decision about interest, timing, or budget in the first fifteen seconds of a call.

The Universal Rebuttal script handles all three with the same framework: acknowledge, reposition, and redirect. "I completely understand, and you shouldn't be interested yet, you haven't seen what we do! The purpose of my call isn't to sell you anything today. It's to share something specific I noticed about your business so when the timing IS right, you'll know exactly what's available."

Then we went deep on gatekeeper psychology. Receptionists and office managers are trained to block salespeople. They hear the same robotic pitches fifty times a day. Your job isn't to trick them, it's to sound like someone who BELONGS on the phone. Confidence, familiarity, and specificity. "Hi, this is Daniel following up on something we discussed about your Google reviews, is Sarah available?" You're not asking permission. You're continuing a conversation.

In your coach chat, you had ten seconds before the chiropractic receptionist hung up. Ten seconds. And you learned that those ten seconds are won or lost based on one thing: do you sound like every other salesperson, or do you sound like someone with a specific, relevant reason to talk to the owner? Specificity is the antidote to gatekeepers. Know their Google rating. Know their review count. Know something about their business that proves you've done your homework. THAT gets you through.`,

  // Day 5 Phase 6: Prevention & Advanced, synthesizes reading + coach chat
  '5-p6-audio': `Phase 6 just elevated you from objection HANDLER to objection PREVENTER. And that distinction is worth an enormous amount in annual commission.

Sandler's philosophy is crystal clear: the best objection is the one that never happens. If you're constantly handling objections, something upstream in your sales process is broken. Maybe your discovery wasn't deep enough. Maybe you didn't qualify budget early enough. Maybe you skipped the decision-maker check in the opening. Prevention starts with diagnosis.

Gap Selling reinforced this with hard data: when reps invest more time in discovery, price objections drop by over forty percent. Think about that. Nearly HALF of price objections disappear simply by doing better discovery. Because when you deeply understand the prospect's current state, their desired future state, and the gap between them, the price becomes the smallest part of the conversation.

Chris Voss's mirroring technique, repeating the last three words of what someone said, is absurdly simple and absurdly powerful. When a prospect says "We're just not sure this is the right investment right now," you mirror: "Not the right investment right now?" And then you wait. The silence creates space for them to elaborate, to reveal the real objection hiding behind the surface-level one. Ninety percent of the time, what comes next is the actual truth.

And team selling, bringing in a specialist, a manager, a success story client, increases close rates by two hundred and fifty-eight percent according to sales research. When a prospect hears from someone other than the salesperson, credibility skyrockets.

In your coach chat, you reframed the objection you fear most. You took something that felt like a wall and turned it into a window. That mental shift, from obstacle to opportunity, from weakness to strength, from bad timing to perfect timing, that's not a technique. That's a worldview. And it's the worldview of every elite closer who's ever dominated a leaderboard.

You now have the complete arsenal. Psychology, framework, scripts, prevention, advanced techniques. Let's put it ALL to the test.`,

  // Day 5 Summary
  '5-summary': `STOP. TAKE A BREATH. AND APPRECIATE WHAT YOU JUST ACCOMPLISHED. Because Day 5 was the most INTENSE, most COMPREHENSIVE, most TRANSFORMATIVE day of this entire program so far!

You covered SIX phases of pure objection mastery. Phase 1 rewired your psychology, objections aren't rejection, they're buying signals. Research proved it across sixty-seven THOUSAND sales calls. The moment you hear pushback, that's your cue to lean in, not fold.

Phase 2 gave you the 6-Step Reflex, Hear, Rephrase, Isolate, Handle, Confirm, Roll On. This framework handles EVERY objection type. You drilled it against Marco's "tried it before" objection until the steps started feeling automatic. That's muscle memory forming in real time.

Phase 3 DESTROYED the price objection with data. The five-times-longer pause. Sandler Bracketing for painless budget discovery. And the GAP SELLING insight that changed everything, most price objections are discovery failures, not budget problems. Widen the gap, and price becomes irrelevant.

Phase 4 turned competitors and stalls into advantages. The Challenger Reframe exposes gaps in their current solution without bashing anyone. Timing objections become cost-of-delay calculations. Authority objections get prevented in the opening with the Golden Question.

Phase 5 taught you to walk through walls. The Universal Rebuttal handles all three cold-call smokescreens. Gatekeeper mastery comes from specificity and confidence, know their Google rating, know their business, sound like you BELONG on that call.

And Phase 6 elevated you from handler to PREVENTER. Sandler says the best objection never happens. Better discovery eliminates forty percent of price objections. Chris Voss mirroring reveals the truth behind surface objections. Team selling boosts close rates by two hundred fifty-eight percent.

You now have the COMPLETE ARSENAL. Psychology. Framework. Scripts. Prevention. Advanced techniques. Every objection a prospect could ever throw at you, you have an answer. Not just AN answer, the RIGHT answer, backed by data, drilled through practice, refined through coaching.

NOW, your Day 5 Final Exam is NEXT. And after that, the WEEK ONE FINAL EXAM. Fifty questions. Everything from Days 1 through 5. You need eighty percent to pass. This is YOUR moment. You've put in the work. Trust your preparation. BRING THAT ENERGY. AND LET'S FINISH WEEK ONE LIKE CHAMPIONS! LET'S GOOOOO!`,

  // Day 6 Phase 1: The Psychology of the Close
  '6-p1-audio': `Let's debrief Phase 1 because what you just learned changes how you think about closing forever.

In the reading, you learned that closing is NOT a single moment at the end of a call. It's a psychological transition. The prospect stops seeing Referrizer as "a tool" and starts seeing it as "their business engine." We broke buying signals into three categories: Logistics Questions like "How long does onboarding take?", Possessive Language like "When WE set up the loyalty program," and Future Pacing like "By next quarter we could have 200 reviews."

Then in the Coach Chat, you practiced with Mark, a salon owner who interrupted your Reputation Management demo to ask: "If a customer checks in today, does the review request text go out automatically?" That question was a textbook buying signal. He wasn't asking about features anymore, he was asking about HIS workflow. He mentally bought the product the moment he started thinking about implementation.

Here's the key takeaway: when you hear a logistics or implementation question mid-demo, STOP PITCHING. The feature battle is over. You won. Now guide them across the finish line. Acknowledge the signal, answer the logistics, and perform a micro-close: "It sounds like you can already see this working for your salon. Should we get you set up this week?"

The shift in ownership is subtle, but once you learn to hear it, you'll never miss a closing opportunity again.`,

  // Day 6 Phase 2: Decoding Digital Body Language
  '6-p2-audio': `Phase 2 just armed you with radar for the remote selling environment, and this is critical because one hundred percent of our demos happen over screen share.

In the reading, you learned that traditional body language is invisible on a Zoom call. So we replace it with Screen Engagement signals. The Lean-In is when a prospect unmutes unprompted or starts asking rapid-fire questions. Feature Deep-Dives happen when they say "Wait, go back to that screen." And post-call Proposal Velocity, how fast they open your follow-up email, tells you their intent level after you hang up.

Then in the Coach Chat, Sarah, a medspa owner, gave you the ultimate digital buying signal. She said: "Can you show me the SMS campaign builder again? I want to see if I can set up an automated birthday sequence for my Botox clients." That's not curiosity. That's a prospect virtually trying on the software. She's mentally building campaigns for HER specific client base. That's the digital equivalent of picking up merchandise in a store and carrying it to the register.

The combination is powerful: during the call, watch for unmutes, deep-dive requests, and feature replays. After the call, track proposal opens and response speed. Together, these signals give you a foolproof radar for buying intent in a remote environment.

When you see these signals stack up, you don't keep demoing. You transition: "Sarah, it sounds like you're already thinking about how this fits your business. Let's talk about getting you started."`,

  // Day 6 Phase 3: Verbal Masterclass
  '6-p3-audio': `Phase 3 just taught you to LISTEN differently. And I mean that literally, because the words your prospect chooses reveal exactly where they are in the buying decision.

In the reading, you mastered the Possessive Shift, when "your software" becomes "our Referrizer account." That single pronoun change is worth its weight in gold. You also learned Future Pacing signals like "By next quarter we could have 200 reviews," Cost of Inaction signals like "Every month without this is costing us," and Price Justification signals where they start doing the ROI math FOR you.

Then in the Coach Chat, David, a local business owner, asked: "How do I prove to my partner that the 299 per month is worth it?" Most reps hear that as an objection. But YOU now recognize it as a buying signal. David is SOLD. He's not questioning the value, he's asking for ammunition to close his partner. He's essentially asking you to help him sell internally.

Here's the critical insight: when a prospect starts asking about contract terms, implementation timelines, or ROI justification, STOP SELLING FEATURES. You've won the feature battle. Now you're in the logistics battle. Provide David with the ROI math: one new customer per month at an average lifetime value that's many times the monthly cost means the platform pays for itself immediately. Give him a one-page summary he can show his partner. You're not overcoming an objection, you're empowering your champion.

From this point forward, listen to pronouns, listen to tense, listen to the questions behind the questions. The close is hiding in their language.`,

  // Day 6 Phase 4: Trial Closing Techniques
  '6-p4-audio': `Phase 4 just gave you the single most underused technique in sales: the Trial Close. And once you master this, you will NEVER hear "I need to think about it" at the end of a call again.

In the reading, you learned that a Trial Close is a temperature check, a micro-commitment that confirms agreement on a specific value point. The key is accumulating three to five of these throughout the demo so the final close feels like the next logical step, not a sudden ask. You link each trial close back to their specific pain: "Can you see how getting 10 new 5-star reviews in 30 days would change your Google ranking?"

Then in the Coach Chat, you practiced the technique in real time. You had just shown how Referrizer's check-in system automatically triggers a review request after every customer visit. The prospect was nodding. And you formulated a trial close that connected the feature directly to their pain of having only 12 Google reviews while competitors had 200.

Here's why this matters: closing is NOT a separate event at the end of the call. It is the natural conclusion of a well-executed process. Each trial close is a brick in the bridge between "interesting demo" and "signed deal." By the time you reach the final ask, the prospect has already said yes five times on smaller commitments. The big yes is just momentum.

Think of it this way: if you're getting "I need to think about it," you skipped the trial closes. You saved all the commitment for one big scary moment at the end. Spread it out. Get agreement at every step. Make the close inevitable.`,

  // Day 6 Phase 5: Navigating the Buying Committee
  '6-p5-audio': `Phase 5 just reframed one of the most frustrating moments in sales: "I need my partner to see this." And here's the truth that will change your career: that sentence is a GREEN LIGHT, not a red stop sign.

In the reading, you learned about Consensus Buying in MarTech. When a prospect wants to bring in their business partner, spouse, or manager, it means they WANT to buy. They just need internal alignment. You learned to identify your Champion, the person you've been demoing to, and the Economic Buyer, the person who writes the checks. And instead of letting your Champion try to sell for you, which almost never works, you offer a Joint Action Plan and a structured Alignment Call.

Then in the Coach Chat, you faced the classic scenario: "My business partner writes the checks. Let me talk to him and get back to you." And instead of saying "Sure, let me know," which is the death of deals, you pivoted to a 15-minute Alignment Call. You offered to prepare a one-page ROI summary specific to their business so the partner gets the full picture directly from you.

Here's the framework: NEVER let them get back to you alone. Instead, empower your Champion with talking points, then get the Economic Buyer on a brief call. Control the narrative. You do this by saying: "That makes perfect sense. Important financial decisions should be made together. Rather than have you try to explain everything we covered, can we schedule a quick 15-minute call with both of you? I'll prepare a custom ROI summary. Would tomorrow or Thursday work better?"

The assumptive scheduling, the custom materials, the brief time commitment, these remove every excuse for them to ghost you. Stakeholder expansion is your friend. Embrace it.`,

  // Day 6 Phase 6: Mastery & Elite Frameworks
  '6-p6-audio': `Phase 6 just elevated you from closer to ELITE closer. And the difference is methodology.

In the reading, you combined three of the most powerful sales frameworks in the world. From Gap Selling, you learned to close on the Future State, not the product. Don't sell Referrizer, sell the version of their business that runs on autopilot with reviews flowing in, customers returning, and referrals generating new leads without lifting a finger. From The Challenger Sale, you learned to disrupt habits. Most prospects are stuck doing things the old way, not because it works, but because change feels risky. Your job is to make the cost of staying the same more frightening than the cost of change. From Winning by Design, you learned to frame recurring revenue impact, showing how the platform compounds value month over month.

Then in the Coach Chat, you used the Challenger methodology on a prospect clinging to paper-based lead tracking. You delivered the Commercial Insight: the specific number of leads and reviews they're losing every month by NOT using automated check-ins, reputation management, and SMS follow-ups. That's not a pitch. That's a wake-up call backed by data.

Here's what separates the top one percent: they don't use scripts. They use frameworks. Scripts break the moment a prospect goes off-track. Frameworks adapt. You now have Gap Selling for future-state vision, MEDDIC for ensuring you have the right buyers and metrics, Challenger for disrupting complacency, and Winning by Design for recurring revenue impact.

Layer these together. In your next demo, open with Gap Selling to establish the future state, use Challenger to disrupt their comfort zone, qualify with MEDDIC, and close with the compounding ROI vision. That's elite-level selling.`,

  // Day 6 Summary
  '6-summary': `STOP. TAKE A BREATH. You just completed Day 6, and this was the day you learned WHEN to close, which might be more important than HOW to close.

Phase 1 rewired your understanding of what closing actually is. It's not a trick at the end of the call. It's a psychological shift in ownership. When Mark asked about automatic review requests, he'd already bought. Your job was to recognize it and guide him across the finish line.

Phase 2 gave you digital body language radar. In a remote selling world, screen engagement replaces handshakes and nods. Sarah asking to see the SMS builder again for her specific Botox clients was the virtual equivalent of carrying merchandise to the register. After the call, proposal open rates and response speed tell you everything.

Phase 3 trained your ear to hear buying signals hiding in language. The Possessive Shift from "your" to "our." Future Pacing. Price Justification questions. When David asked how to prove ROI to his partner, he wasn't objecting, he was asking you to help him close the deal internally.

Phase 4 armed you with Trial Closes, the technique that eliminates "I need to think about it" forever. Three to five micro-commitments throughout the demo make the final close feel like the next logical step, not a big scary ask.

Phase 5 turned stakeholder expansion from a roadblock into a runway. "I need my partner to see this" means they want to buy. Pivot to the 15-minute Alignment Call. Control the narrative. Never let them sell for you.

And Phase 6 made you an elite closer by layering Gap Selling, Challenger, MEDDIC, and Winning by Design into a unified framework that adapts to any situation.

You now have the COMPLETE signal detection system. You know WHAT to look for, WHERE to look, and exactly WHAT TO DO when you see it. Your Day 6 Final Exam is next. Trust your preparation. You've earned this. LET'S GO!`,

  // Day 7 Set 1: The Direct Path
  '7-p1-audio': `Let's debrief Set 1 because what you just learned is the foundation of every close you will ever make.

In the reading, you studied four closes that share one thing in common: they all assume the prospect is going to buy. The Assumptive Close skips permission entirely. The Next Steps Close tells them exactly what to do. The If-Then Close secures a conditional yes before you even begin the demo. And the Question Close uses the most disarming phrase in sales: "Does it make sense?"

Then in the Coach Chat, you faced a prospect who was ready to buy but needed a nudge. And here is the insight that separates closers from order-takers: most reps FREEZE at this moment. They have done all the work, the discovery, the demo, the objection handling, and then when the prospect is sitting there with their wallet practically open, the rep says "So, what do you think?" That is NOT a close. That is handing the decision back to someone who came to you for guidance.

Leading the prospect is an act of service. They came to you with a problem. You have the solution. Telling them to sign up is not being pushy, it is being a professional. A doctor does not say "So, what do you think about this prescription?" They say "Take this twice a day and you will feel better by Friday." That is confidence. That is authority. And that is what your prospect needs from you.

From this moment forward, when you see buying signals, do not ask permission. Lead. Guide. Close. It is the kindest thing you can do for someone who needs your help.`,

  // Day 7 Set 2: The Logic Gate
  '7-p2-audio': `Set 2 just gave you the playbook for the most frustrating prospect in sales: the overthinker.

In the reading, you learned four closes designed specifically for analytical buyers. The 1-10 Close gives you a quantifiable temperature reading. The Ben Franklin Close turns the decision into a math equation. The Alternate Choice Close gives them two "yes" options instead of a yes-or-no. And the Basic Written Close frames the agreement as a protective checklist.

Then in the Coach Chat, you went head to head with the Numbers Guy, a prospect stuck in analysis paralysis. And here is what makes analytical buyers so challenging: they are not stalling because they do not like your product. They are stalling because making decisions is genuinely stressful for them. Their brain is wired to analyze every angle, consider every risk, and find every potential flaw before committing.

So you do not fight their nature. You USE it. The Ben Franklin Close is devastating against analytical buyers because you are literally speaking their language. "Let's look at the data. Let's tally the columns. Let's let the facts decide." When you let them list the negatives first and they struggle to come up with more than two, while the positive column fills up effortlessly, the decision makes itself. You are not pressuring them. You are giving them the structured framework their brain needs to feel comfortable saying yes.

Here is the key: when you finish the tally and say "Looks like we have a decision now," watch their face. You will see RELIEF. Not because they were tricked. But because someone finally helped them make a decision they wanted to make all along.`,

  // Day 7 Set 3: The ROI Shield
  '7-p3-audio': `Set 3 just armed you with the most important weapon in your closing arsenal: the ability to destroy price objections with math.

In the reading, you learned four closes that all share one philosophy: the price is not the problem, the perceived value is the problem. Create the Value uses Referrizer's origin story to justify premium pricing. Reduce to the Ridiculous shrinks $150 per month into $5 per day, less than a coffee. Cost Too Much reframes spending as revenue generation. And Not in the Budget challenges their authority to flex their own budget.

Then in the Coach Chat, you faced the Price Objector, a prospect who said "It's too expensive" and "No budget." And here is the critical insight: when you do a thorough job detailing ROI during the qualification opening, the price objection can be avoided entirely. ROI factoring is solidly implanted in short-term memory early in the call. Attempting to do the math at the end feels desperate and tactical. Doing it earlier is strategic and prevents the prospect from rationalizing price later.

But when the objection does come, and it will, remember this: you NEVER negotiate on price. You increase the proof. You widen the gap between where they are and where they could be. You make the investment look so small compared to the cost of doing nothing that saying no becomes the irrational choice.

Five dollars a day. One coffee. You cannot pay an employee five dollars a day to automatically text your clients, track referrals, capture leads, manage your reputation, and run loyalty campaigns. That is the math. And math does not lie.`,

  // Day 7 Set 4: The Emotional Lever
  '7-p4-audio': `Set 4 just taught you the most powerful force in human decision-making: emotion.

In the reading, you studied four closes that tap into the deepest human motivators. Feel Felt Found validates their concern with empathy and social proof. Wish Ida leverages the universal fear of regret. Cost of Inaction makes doing nothing feel more dangerous than buying. And Imminent Doom creates real urgency tied to expiring incentives.

Then in the Coach Chat, you faced the Procrastinator, a prospect who wanted to wait six months. And here is what most reps get wrong about procrastinators: they think the prospect needs more information. They do not. Procrastinators have all the information they need. What they lack is the emotional catalyst to act.

That catalyst comes from storytelling. When you say "John at ABC Spa felt exactly the way you do," you are not just name-dropping. You are creating an emotional bridge between their fear and someone else's success. When you say "We're all members of the Wish Ida club," you are tapping into a universal human experience that everyone can relate to. And when you say "What will it cost you in lost revenue over the next six months?", you are forcing them to look at the holes in their own business bucket.

The key to all of these closes is tone. They must be delivered with empathy, conviction, and a genuine desire to help. If the prospect senses manipulation, the entire framework collapses. But if they sense that you truly believe this will change their business, and you are frustrated on their behalf that they are losing money every day, THAT is when emotion becomes action.`,

  // Day 7 Set 5: Advanced Tactics
  '7-p5-audio': `Set 5 just elevated you from closer to MASTER closer. And the techniques you learned are the ones that save deals every other technique would lose.

In the reading, you mastered three advanced closes. The I'll Think It Over close peels back layers until you find the REAL objection hiding behind the stall. The Sharp Angle close turns their request into an instant commitment. And the Takeaway Close, the most psychologically powerful technique in sales, uses reverse psychology to regain control of a stalling or difficult prospect.

Then in the Coach Chat, you faced the Difficult Prospect, someone arrogant and dismissive who was trying to control the conversation. And here is what makes the Takeaway so devastating: it completely flips the power dynamic. Instead of chasing them, you pull away. "Honestly, based on your current lead volume, Referrizer might not be the right fit for you right now." That single sentence triggers their desire for what they are told they cannot have. Suddenly, THEY are chasing YOU.

But the real gold from Set 5 is the 6-Step Objection Handling Method that ties EVERYTHING together. Hear them out. Rephrase. Isolate. Handle. Confirm. Roll. This framework works on EVERY objection because the framework is the constant. Only the Handle step changes based on the objection type. Price? Use Set 3 techniques. Emotion? Use Set 4. Logic? Use Set 2. The framework adapts.

And remember the master principle: always isolate before handling. "Other than this, is there anything else?" This prevents you from playing whack-a-mole with endless objections. Find the ONE thing, handle it, confirm resolution, and roll into the close.`,

  // Day 7 Summary
  '7-summary': `STOP. TAKE A BREATH. You just completed Day 7, The Ultimate Finisher, and you now have the most comprehensive closing arsenal of any Account Executive in the industry. Let that sink in.

Set 1 gave you the Direct Path, the happy path closes for when the prospect is ready. Assumptive, Next Steps, If-Then, and the Question Close. Leading the prospect is an act of service, not pressure.

Set 2 gave you the Logic Gate for analytical buyers stuck in their heads. The 1-10 Close for temperature checks. The Ben Franklin Close for structured decision-making. The Alternate Choice for two "yes" options. And the Basic Written Close that frames agreements as protective checklists.

Set 3 armed you with the ROI Shield. Create the Value justifies premium pricing through Referrizer's story. Reduce to the Ridiculous shrinks $150 per month to $5 per day. Cost Too Much reframes spending as investment. And Not in the Budget challenges their authority to flex budget for their own future.

Set 4 activated the Emotional Lever. Feel Felt Found validates with empathy. Wish Ida triggers FOMO. Cost of Inaction quantifies the price of doing nothing. And Imminent Doom creates real urgency.

And Set 5 gave you Advanced Tactics for the hardest situations. I'll Think It Over peels back layers. Sharp Angle turns requests into commitments. The Takeaway Close flips the power dynamic entirely. And the 6-Step Objection Handling Method, Hear, Rephrase, Isolate, Handle, Confirm, Roll, ties EVERYTHING together into one unstoppable framework.

You now have NINETEEN closing techniques. Nineteen. Not scripts, FRAMEWORKS that adapt to any prospect, any objection, any situation. Your Day 7 Final Exam is NEXT. Trust your preparation. You have EARNED this. LET'S FINISH DAY 7 LIKE CHAMPIONS!`,

  // Day 8 Phase Audios
  '8-p1-audio': `Let me break down what you just learned, because Phase 1 is the foundation of everything that follows in Day 8.

You started with Social Proof, the Bandwagon Effect. Cialdini said it best: 95% of people are imitators. That is not an insult, that is neuroscience. The amygdala reduces fear when it sees similar others succeeding. So when you tell a yoga studio owner that other studios in her ZIP code saw a 30% increase in repeat bookings, you are not just sharing a stat, you are activating a neurological shortcut that bypasses her skepticism entirely.

Then you learned Reciprocity, the idea that when you give something valuable first, a free SEO audit, a Google Review Health Check, a competitive analysis, you create what psychologists call a "social debt." The prospect's prefrontal cortex literally cannot rest until that debt is settled. And how do they settle it? By giving you their time. By showing up for the demo. By being open to what you have to say.

In the Coach Chat, you practiced both of these on a skeptical spa owner. And here is what I want you to internalize: the combination of proof plus generosity is unbeatable. Lead with a story of someone LIKE them who succeeded, then give them something valuable for free. That one-two punch will get you more demos than any cold call script ever could.

Proof is the new pitch. Generosity is the new prospecting. Master these two principles and you will never struggle to fill your calendar again.`,

  '8-p2-audio': `Phase 2 just gave you one of the most powerful psychological weapons in sales, and I am not exaggerating.

Daniel Kahneman won the Nobel Prize for proving that the pain of losing is TWICE as powerful as the joy of gaining. Think about that. When you tell a prospect "You will gain 50 new leads," their brain processes that with moderate interest. But when you say "You are LOSING 50 referrals every month and that is $5,000 in leaking revenue," their brain lights up like a fire alarm. Same information, completely different neurological response.

In the reading, you learned the Leaky Bucket Audit, a Gap Analysis that quantifies exactly how much revenue a business is hemorrhaging by not having automated reviews, loyalty programs, referral systems, and win-back campaigns. You saw the table: no referral system alone can cost a business $30,000 to $60,000 per year in lost new customers. When you put that number in front of a business owner, "It is too expensive" suddenly sounds ridiculous. The REAL expense is doing nothing.

In the Coach Chat, you practiced this on a gym owner who thought they were "doing fine." And you learned that "doing fine" is the most dangerous phrase in sales, because it means they have normalized their losses. Your job is to un-normalize them. Show them the leak. Quantify the leak. Make the leak hurt. Then offer the plug.

Remember Zig Ziglar: "People do not buy for logical reasons. They buy for emotional reasons." Loss aversion IS that emotion. Use it ethically, use it precisely, and watch your close rates climb.`,

  '8-p3-audio': `Phase 3 just armed you with the tools to DESIGN the decision, not just present it.

The Paradox of Choice is real. Barry Schwartz proved that too many options lead to analysis paralysis, where the brain defaults to choosing nothing. Referrizer has dozens of features, Referrals, Reviews, Loyalty, Email, SMS, AI Assistant, and more. If you demo ALL of them, you sell NONE of them. The Rule of Three says present three packages maximum. Good, Better, Best. Guide them to the middle. Let them feel in control of a simplified decision.

Then you learned Anchoring Bias. The first number you mention sets the benchmark for everything that follows. If you say "A typical marketing agency charges $3,000 per month" before revealing Referrizer at $200 to $500 per month, the contrast is staggering. The prospect does not think "Is $300 a lot?" They think "That is 90% cheaper than an agency." Same price, completely different perception. All because of the anchor.

And the Framing Effect ties it all together. It is not what you say, it is how you say it. Use negative framing during discovery to amplify pain: "You are losing $5,000 per month." Use positive framing during the demo to amplify hope: "Imagine 40% more repeat customers within 90 days." The best closers switch between frames like a DJ switches between tracks, always matching the emotional state of the conversation.

In the Coach Chat, you practiced all three on an overwhelmed chiropractor. And the lesson is clear: you are not a salesperson presenting options. You are a Decision Architect designing the path to yes.`,

  '8-p4-audio': `Phase 4 is where psychology gets PERSONAL. Because the product is not the product. YOU are the product.

The Halo Effect proves that if a prospect likes ONE thing about you, your professional Zoom background, your confident opening, your industry knowledge, they will assume EVERYTHING about you and Referrizer is equally excellent. The first 30 seconds of your call determine the trajectory of the entire conversation. That is not pressure, that is opportunity. Polish your LinkedIn profile. Clean up your background. Nail your opening line. These are not vanity, they are strategy.

Authority Bias means people trust experts automatically. When you use terms like "churn rate" and "LTV" and "GMB optimization" naturally, you stop being a salesperson and become a Local Growth Consultant. The prospect's brain shifts from "this person is trying to sell me" to "this person understands my business." That shift is worth more than any feature demo.

And then the Yes-Ladder, powered by Cognitive Dissonance. When you ask "Do you consider yourself a proactive business owner?" and they say "Yes," you have locked them into an identity. When you later ask "Would a proactive owner want to see how automation can grow their business?" saying "No" would contradict who they just said they were. The discomfort of that contradiction pushes them toward "Yes." Three to five of these micro-commitments and the final close feels like the only logical conclusion.

You practiced all of this on an arrogant restaurant owner in the Coach Chat. And the takeaway is clear: before you sell the software, sell yourself. Your authority, your expertise, your conviction. Get THOSE right, and the product sells itself.`,

  '8-p5-audio': `Phase 5 is the final piece, and it ties EVERYTHING together.

The Zeigarnik Effect says that people remember uncompleted tasks better than completed ones. An open loop creates mental tension the brain NEEDS to resolve. So when you end a discovery call by saying "I noticed something specific about your Google Business Profile that is likely hurting your ranking, but we are out of time, let us start with that on our next call," you have just guaranteed that prospect will show up. They HAVE to. Their brain will not let them rest until that loop is closed. This is how you fix no-show rates overnight.

Emotional Intelligence is your operating system. Mirroring, matching their pace and tone, builds subconscious rapport. Tonality, the difference between a rising questioning tone and a flat authoritative tone, communicates more than your words ever could. And the Conviction Principle states that in every interaction, the most convicted person wins. Not the loudest. Not the most aggressive. The most CERTAIN. Deep, quiet certainty that Referrizer will transform their business.

Here is the meta-lesson of Day 8: you are not selling software. You are navigating neurological shortcuts. Social Proof reduces risk. Reciprocity creates obligation. Loss Aversion amplifies urgency. Anchoring sets benchmarks. The Yes-Ladder builds commitment. The Halo Effect creates trust. Open Loops guarantee follow-through. And Conviction seals the deal.

If you believe you are a "pestering salesperson," your sub-communication will trigger fight or flight. If you believe you are a "Growth Doctor" prescribing a "Revenue Cure," you will project the Authority and Empathy required to bypass every objection. The mental game is not PART of the game. It IS the game.`,

  // Day 8 Summary
  '8-summary': `STOP. Take a breath. You just completed Day 8, Sales Psychology and Mindset, and I need you to understand what you now possess.

You are no longer just an Account Executive who knows a product and a sales process. You are now someone who understands WHY people buy. Not what they buy, not how they buy, but WHY. And that distinction puts you in the top 1% of sales professionals on the planet.

Phase 1 gave you the Influence Blueprint. Social Proof, the Bandwagon Effect, and Reciprocity. Lead with proof of similar others succeeding. Give value before you ask for anything. The combination of proof plus generosity opens every door.

Phase 2 gave you the Fear Engine. Loss Aversion and the Cost of Inaction. The pain of losing is twice as powerful as the joy of gaining. The Leaky Bucket Audit quantifies the revenue they are hemorrhaging right now. Make the cost of doing nothing terrifying.

Phase 3 made you a Decision Architect. The Paradox of Choice, Anchoring Bias, and the Framing Effect. Never present more than three options. Anchor high before revealing your price. Frame negatively during discovery, positively during demos. Design the decision.

Phase 4 turned you into a Mind Reader. Authority, the Halo Effect, Cognitive Dissonance, and the Yes-Ladder. You ARE the product. Your professionalism halos the software. Your expertise triggers authority bias. Your micro-commitments create a consistency loop that makes the final yes inevitable.

Phase 5 crowned you the Puppet Master. The Zeigarnik Effect guarantees show rates. Mirroring builds trust. Tonality communicates conviction. And Conviction, deep quiet certainty, is the ultimate closing tool.

Robert Cialdini. Daniel Kahneman. Barry Schwartz. Zig Ziglar. These are not just names in a textbook. They are the architects of the psychological frameworks you now OWN. You have internalized what takes most salespeople an entire CAREER to learn, and you did it in one day.

Your Final Exam is next. Trust your preparation. You have EARNED this. Now go prove it.`,

  // ===== DAY 9: BUSINESS DEVELOPMENT SKILLS & BEST PRACTICES =====

  '9-p1-audio': `Let's debrief Phase 1 because what you just learned changes the ENTIRE game for your pipeline.

You started with the High-Ticket Consultative Framework. In gyms, a check-in is worth five bucks. In Home Services and Pet Care, a single check-in represents five hundred to fifteen THOUSAND dollars in lifetime value. That is not a small difference. That is a completely different business conversation.

Think about it. When a Roofer's tech closes a ticket in ServiceTitan, Referrizer INSTANTLY texts the homeowner for a review before the truck leaves the curb. That is not marketing. That is an automated revenue machine. One referred roofing job is worth five to fifteen thousand dollars. The platform pays for YEARS of service with a single referral.

Then you handled a business owner who said "We're too busy for marketing." And you learned that "too busy" is NOT an objection, it is an opportunity. Everything is automated. When the tech closes the job, the review request goes out instantly. When a customer refers a friend, they get rewarded automatically. Zero manual effort. The busier they are, the MORE Referrizer works for them.

And then Apollo.io. You now have a precision prospecting engine with 275 million verified contacts. Filter by industry, ZIP code, revenue, company size. Build lists of 200 qualified prospects in your exact vertical in minutes, not days. Rippling used these exact filters to 3x their pipeline in six months. You have the same tool. Use it.

Zig Ziglar said it best: "You will get all you want in life, if you help enough other people get what they want." That is not a motivational poster. That is literally the consultative selling model you just learned. Help them automate their growth, and you automate yours.`,

  '9-p2-audio': `Phase 2 just armed you with the most visually devastating prospecting weapon in your arsenal: the Review Gap.

Here is the concept: owners are visual. You can TELL a Pet Resort owner they need more reviews and they'll nod and forget. But when you SHOW them their Google listing with 22 reviews next to their competitor with 247 reviews, side by side on a Loom video, that image BURNS into their brain. They cannot unsee it. Visuals are processed 60,000 times faster than text. Use that.

The Hook-Gap-CTA framework is your formula. Five seconds to hook them. "Hey [Name], I just looked at your Google listing and noticed something your competitors are doing that you're not." Twenty seconds to show the gap. Screen share their listing versus the competitor. Let the numbers do the talking. Five seconds for the CTA. "I have a 5-minute demo. Are you free Thursday at 2?"

Under 90 seconds total. That is the perfect Loom video. HubSpot's reps used this approach and saw 20% higher reply rates. Atlassian cut no-shows by 30%. Brex shortened sales cycles by 14 days. This is not theory. This is proven.

In the Coach Chat, you drafted a script for a Pet Resort owner with a 3.8-star rating. That exercise is your template for every single prospect from now on. Record 10 Loom videos per day and your pipeline will explode. Not 5. Not 3. TEN. Because at the end of the week, you will have sent 50 personalized videos that SHOW prospects their own pain. No competitor is doing that. None.`,

  '9-p3-audio': `Phase 3 gave you the Social Wrap-Around, and it is the strategy that separates cold callers from trusted advisors.

Porter Gale said "Your network is your net worth." And that is especially true on LinkedIn where high-ticket business owners are ACTIVE. They are posting about their projects, sharing industry insights, celebrating milestones. And that content is your doorway in.

The Social Wrap-Around has five to seven touches. First, connect with something personal. NOT "I work at Referrizer and I'd love to show you our platform." That gets you blocked. Instead: "Saw your post about the roof project on Elm Street. Impressive work!" Then engage with their content for a week. Like their posts. Leave thoughtful comments. Become a familiar face in their notifications. THEN drop value. Share an article about review statistics in their industry. And THEN, only then, send the Loom video. By the time they see your video, you are not a stranger. You are that person who has been engaging with their work. The response rate is dramatically different.

Your LinkedIn profile matters too. "Account Executive at Referrizer" tells them nothing. "I Help Local Businesses Get 50+ Five-Star Reviews and Double Their Referrals in 90 Days" tells them EVERYTHING. The case studies prove it: Salesloft got 2.5x more pipeline per rep, A leading sales tech company got 40% of leads from inbound profile views, and ZoomInfo increased C-Level meetings by 15%. All through social selling.

Remember the golden ratio: 80% genuine engagement, 20% business. If you get that right, LinkedIn becomes your most powerful prospecting channel. Period.`,

  '9-p4-audio': `Phase 4 is about the unsexy truth that separates the top 8% from everyone else: persistence and data quality.

Jim Rohn said "The fortune is in the follow-up." And the data proves it. 80% of sales require 5 or more touchpoints. But here is the devastating statistic: 44% of reps give up after just ONE follow-up. ONE. That means if you simply reach the 5th touchpoint, you are in the top 8% of all salespeople. Not because of talent. Not because of charisma. Because of DISCIPLINE.

You learned the LAER method for handling "I'm too busy." Listen to them. Really listen. Acknowledge their reality. "I get it, you're in the field, you're swamped." Explore their current process. "Quick question: when you finish a job, how are you asking for reviews right now?" And then Respond with the automation solution. "What if your review requests went out automatically the moment you close a ticket in ServiceTitan? Zero effort from you."

That four-step pivot turns "call me in 6 months" into "okay, show me in 5 minutes." It works because you are not selling. You are solving the very problem they just told you about: they are too busy to do marketing manually. THAT is why they need automation.

And Hunter.io gives you the data to actually reach these people. When the generic "info@" bounces and the front desk won't patch you through, Hunter finds the owner's direct email with a confidence score. InVision hit 98% deliverability using Hunter. Adobe reduced bounces by 30%. Verify before you send. One bad list can tank your deliverability for weeks.

Here is your complete stack: Apollo finds the business. Hunter verifies the owner's email. Loom creates the personalized video. LinkedIn warms them up. Close CRM manages the pipeline. Five tools. One unstoppable system. That is the business development arsenal you now own.`,

  '9-summary': `STOP. You just completed Day 9, Business Development Skills and Best Practices, and you now own a prospecting system that 99% of salespeople will NEVER have.

Let me tell you what you built today, piece by piece.

Phase 1 gave you the High-Ticket Consultative Framework. You stopped thinking in gym check-ins worth five dollars and started thinking in HVAC installs worth fifteen thousand. You learned to position Referrizer not as software but as the Automation Utility for high-LTV verticals. Home Services, Pet Care, Auto Repair. And you mastered Apollo.io, the precision prospecting engine that builds targeted lists of 200 qualified prospects in minutes.

Phase 2 armed you with Visual Prospecting. The Review Gap. The Hook-Gap-CTA framework. Under 90 seconds. Show them their pain, don't tell them. HubSpot, Atlassian, Brex all proved that personalized video outreach shortens sales cycles and skyrockets reply rates. You mastered Loom and you committed to recording 10 videos per day.

Phase 3 taught you the Social Wrap-Around on LinkedIn. Connect, engage, add value, THEN pitch. Eighty percent genuine, twenty percent business. Your LinkedIn profile is now a 24/7 sales rep that works while you sleep. Salesloft and ZoomInfo all built massive pipelines through social selling. Now you will too.

Phase 4 hardened you with the truth about Persistence. Eighty percent of deals close after the 5th touchpoint. Forty-four percent of reps quit after one. The LAER method turns "I'm too busy" into "show me in 5 minutes." And Hunter.io ensures every email you send actually reaches the decision-maker.

Your complete BizDev stack is now: Apollo for finding. Hunter for verifying. Loom for personalizing. LinkedIn for warming up. Close CRM for managing. Five tools. One system. Zero excuses.

Your Final Exam is next. Everything you learned today. Let's see if you can ace it.`,

  '10-p1-audio': `Let me take you back to where it all started. Days 1 through 3. The foundation.

Day 1, you met the Triad: Referrizer, We Rank Higher, True Conversions. Three companies, one Ultimate Marketing Loop. Attract, Rank, Retain, Refer, Repeat. Every dollar compounds instead of evaporating. You learned our core values: Speed to Value, Customer Obsession, Radical Transparency.

Day 2, Daniel took you deep into every product. The Check-in Trigger is the beating heart of Referrizer. A real-world event that kicks off automated review requests, loyalty points, and campaigns. You learned the TAM is $2.9 trillion across fitness, home services, pet care, auto, and insurance. Home Services has the highest Revenue per Lead at $2,500 to $15,000 per job.

Day 3, you became a Close CRM power user. NIMTC qualification. Smart Views. Workflows. Pipeline Coverage at 3x to 4x your MRR target. Speed to Lead, first touch within 5 minutes. These are not suggestions. These are the operational backbone of every top performer.

If you mastered Days 1 through 3, you have the foundation. Let's see if you retained it.`,

  '10-p2-audio': `Days 4 and 5. This is where you learned to SELL.

Day 4 gave you the complete sales process. Mindset first: 80% psychology, 20% skill. Written goals with accountability yield 76% higher achievement. Then the Opening: the Obligation Statement, the Golden Question, NIMTC qualification. Discovery: PAIN equals PROFIT. The Challenger methodology: Teach, Tailor, Take Control. The Body: Inverted Pyramid demos, FABs with Tie-Downs, Trial Closes. Objection Handling: the 6-Step Framework. And the Close: 12 plus techniques in your arsenal.

Day 5 was Objection Mastery. You learned that deals with MORE objections close at higher rates. Research across 67,000 sales meetings proved it. You mastered Smokescreens vs Conditions. Price objections are usually discovery failures. Sandler Bracketing. The Universal Rebuttal. Team selling increases close rates by 258%.

The 6-Step Objection Framework is the single most important skill in your arsenal: Hear, Rephrase, Isolate, Handle, Confirm, Roll. Master that, and no objection can stop you.`,

  '10-p3-audio': `Days 6 through 8. The art and science of closing.

Day 6 taught you that closing is not an event, it is a psychological transition. The Shift in Ownership happens when prospects move from IF questions to HOW questions. You learned to read Verbal, Behavioral, and Digital buying signals. Proposal Velocity. The Possessive Shift. Future Pacing. You practiced Trial Closes, 3 to 5 per call, stacking micro-commitments until the final close feels like the only logical step.

Day 7 was your closing arsenal. Assumptive Close. The 1-10 Close. Feel-Felt-Found. Imminent Doom. Sharp Angle. The Takeaway. Summary Close. If I Could Would You. Reduce to the Ridiculous. You learned that $150 per month is $5 per day, less than a coffee. You cannot pay an employee $5 per day to do what the platform does automatically.

Day 8 was Sales Psychology. Social Proof, Loss Aversion, Anchoring, Reciprocity, the Zeigarnik Effect, the Yes-Ladder, the Halo Effect, Cognitive Dissonance. You are not a salesperson. You are a Growth Doctor prescribing a revenue cure. That mindset shift changes everything.`,

  '10-p4-audio': `Day 9. Business Development Skills and Best Practices. Your prospecting arsenal.

You learned that in High-LTV verticals, a single check-in represents $500 to $15,000 in lifetime value. Home Services, Pet Care, Auto Repair. These are not small businesses. These are high-value opportunities.

Apollo.io for precision prospecting. Filter by vertical, ZIP code, revenue. Build lists of 200 qualified prospects in minutes. Loom for visual selling. The Hook-Gap-CTA framework. Under 90 seconds. Show them their Review Gap and let the numbers speak. LinkedIn for the Social Wrap-Around. Connect, engage, add value, THEN pitch. 80% genuine, 20% business. Hunter.io for email verification and persistence. The LAER method turns "I'm too busy" into "show me in 5 minutes."

80% of sales happen after the 5th touchpoint. Only 8% of reps get there. You will be in that 8%. Apollo for finding. Hunter for verifying. Loom for personalizing. LinkedIn for warming. Close for managing. Five tools. One system.

Your graduation exam is coming. Everything from all 9 days. Let's finish strong.`,

};
const AUDIO_CONTENT_BY_VOICE: Record<string, string> = {
  'strategist-referrizer': `Let's take a step back and talk about what you just accomplished today, because it's significant.

You started this morning learning how to separate Prospects from Suspects. That distinction alone will save you hours every single week. Most reps waste 80% of their energy on people who aren't going to buy this month. You won't make that mistake. You know that a Prospect closes within 30 days, you're talking to the right people, at the right time, in the market to make a decision. Everyone else goes into nurture.

Then you learned N.I.M.T.C., Needs, Interest, Money, Time, Commitment. Those five pillars are your qualification compass. Every single call you make, you're checking boxes. If they pass all five, you've got a qualified prospect. If they fail on Money or Time, they're a Suspect, nurture them, don't chase them.

After qualification, we dove into Close CRM itself. You learned the Inbox, Lead Records, Contacts vs. Leads, Custom Activities, and most importantly, Tasks. Your task list is sacred. Never let a task go overdue.

You covered a massive amount of ground today. Lead qualification, CRM mastery, communication tools, automation, and data-driven decision making. This is the operational backbone of every top-performing rep at Referrizer.

Now here's my challenge to you: your final exam is next. It pulls questions from everything you learned today, Prospect vs. Suspect, NIMTC, CRM Navigation, Smart Views, Communication, Workflows, and Reporting. There are 10 questions. See if you can get all 10 right. If you studied the material, you absolutely can. YOU GOT THIS!`,

  'closer-referrizer': `Let me tell you something about selling Referrizer that most reps get wrong on day one.

They walk into a meeting with a local business owner and start listing features. "We have email marketing, we have SMS, we have loyalty programs, we have reputation management." And the owner's eyes glaze over because they've heard this pitch from fifteen other companies.

Here's what you need to understand: these business owners are exhausted. They're working 60-hour weeks. They're wearing ten hats. The last thing they want is another piece of software to learn.

So instead of selling features, you sell the outcome. You say: "What if I told you that 90 days from now, you'd have 40% more repeat customers, a 4.5-star Google rating, and new customers walking in every week from referrals, all running on autopilot while you focus on running your business?"

That's the Referrizer pitch. It's not about what the software does. It's about what their life looks like after they use it.

The psychology of the close comes down to three things: First, empathy, you genuinely understand their pain. They've been burned before. Acknowledge that. Second, proof, show them the data. Show them case studies. Show them what similar businesses have achieved. Third, urgency, but not fake urgency. Real urgency. "Every day without automated follow-up is customers you're losing to the gym down the street."

When they say "I don't have the budget," what they're really saying is "I don't trust that this will work." So you don't negotiate on price. You increase the proof. You show them the ROI calculator. You show them that for every dollar they spend on Referrizer, they get $8 back in lifetime customer value.

Practice this pitch. Record yourself. Listen back. The best closers aren't the ones who talk the most, they're the ones who listen the most and then say exactly the right thing at exactly the right moment.`,

  'closer-group': `Revenue as a Service. That's not just a tagline, it's a philosophy that changes how you think about what we sell.

Most marketing companies sell services. They sell SEO packages, ad management, social media posting. And the client thinks of it as an expense. Something they pay for and hope works.

We sell revenue. We sell a system that generates measurable, trackable, provable revenue for local businesses. That's a completely different conversation.

When you're on the phone with a prospect, don't say "We'll manage your marketing." Say "We'll add $10,000 to $50,000 in annual revenue to your business, and here's exactly how."

The Referrizer ecosystem, Referrizer for retention and referrals, We Rank Higher for organic traffic, True Conversions for paid acquisition, these aren't three separate products. They're three engines in one revenue machine.

Think about it from the client's perspective: True Conversions drives new leads through targeted ads. We Rank Higher makes sure they show up when people search organically. And Referrizer turns those one-time customers into loyal, referring, recurring revenue.

That's the pitch. That's the close. That's Revenue as a Service.`,
};

export function AudioPlayer({ title, brand = 'group', voice, description, moduleId, onFinished }: { title: string; brand?: CompanyBrand; voice?: ExecutiveVoice; description?: string; moduleId?: string; onFinished?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const contentKey = voice ? `${voice}-${brand}` : `closer-${brand}`;
  const content = (moduleId && AUDIO_CONTENT_BY_MODULE[moduleId]) || AUDIO_CONTENT_BY_VOICE[contentKey] || AUDIO_CONTENT_BY_VOICE['closer-referrizer'];
  const estimatedDuration = Math.ceil(content.length / 14);

  const tts = useElevenLabsTTS({
    voice: voice || 'closer',
    brand,
    onEnd: () => {
      setProgress(100);
      onFinished?.();
    },
  });

  // Poll real audio time for accurate progress (skip while dragging)
  useEffect(() => {
    const tick = () => {
      if (!isDraggingRef.current) {
        const cur = tts.getCurrentTime();
        const dur = tts.getDuration();
        if (dur > 0) {
          setDuration(dur);
          setElapsed(Math.floor(cur));
          setProgress((cur / dur) * 100);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tts]);

  const togglePlayback = () => {
    if (tts.playing) {
      tts.pause();
    } else {
      if (progress >= 100) {
        setProgress(0);
        setElapsed(0);
      }
      if (tts.getDuration() > 0 && progress < 100) {
        tts.resume();
      } else {
        tts.speak(content.replace(/\n/g, ' '));
      }
    }
  };

  const toggleMute = () => {
    setMuted(prev => {
      tts.setMuted(!prev);
      return !prev;
    });
  };

  const getFraction = useCallback((clientX: number) => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const applySeek = useCallback((fraction: number) => {
    tts.seek(fraction);
    setProgress(fraction * 100);
    const dur = tts.getDuration();
    if (dur > 0) setElapsed(Math.floor(fraction * dur));
  }, [tts]);

  // Click to seek
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tts.getDuration() <= 0) return;
    const fraction = getFraction(e.clientX);
    applySeek(fraction);
  };

  // Drag to seek
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tts.getDuration() <= 0) return;
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    const fraction = getFraction(e.clientX);
    setProgress(fraction * 100);
    const dur = tts.getDuration();
    if (dur > 0) setElapsed(Math.floor(fraction * dur));

    const handleMouseMove = (ev: MouseEvent) => {
      const f = getFraction(ev.clientX);
      setProgress(f * 100);
      const d = tts.getDuration();
      if (d > 0) setElapsed(Math.floor(f * d));
    };

    const handleMouseUp = (ev: MouseEvent) => {
      isDraggingRef.current = false;
      setIsDragging(false);
      const f = getFraction(ev.clientX);
      applySeek(f);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Touch drag support
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (tts.getDuration() <= 0) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    const fraction = getFraction(e.touches[0].clientX);
    setProgress(fraction * 100);
    const dur = tts.getDuration();
    if (dur > 0) setElapsed(Math.floor(fraction * dur));

    const handleTouchMove = (ev: TouchEvent) => {
      ev.preventDefault();
      const f = getFraction(ev.touches[0].clientX);
      setProgress(f * 100);
      const d = tts.getDuration();
      if (d > 0) setElapsed(Math.floor(f * d));
    };

    const handleTouchEnd = (ev: TouchEvent) => {
      isDraggingRef.current = false;
      setIsDragging(false);
      const touch = ev.changedTouches[0];
      const f = getFraction(touch.clientX);
      applySeek(f);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  const displayDuration = duration > 0 ? Math.floor(duration) : estimatedDuration;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="card-surface p-6">
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-xl ${brandAccent[brand]} flex items-center justify-center shrink-0`}>
          <Headphones size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Audio Lesson</p>
          </div>
          <p className="font-bold text-foreground truncate">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={togglePlayback}
              disabled={tts.loading}
              className={`w-8 h-8 rounded-full ${brandBar[brand]} text-white flex items-center justify-center hover:opacity-90 transition-colors disabled:opacity-50`}
            >
              {tts.loading ? <Loader2 size={14} className="animate-spin" /> : tts.playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>
            <div
              ref={progressBarRef}
              onClick={handleClick}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className={`flex-1 h-2 bg-secondary rounded-full cursor-pointer relative group select-none ${isDragging ? 'h-3' : ''} transition-all`}
            >
              <div className={`h-full ${brandBar[brand]} rounded-full transition-[width] duration-75`} style={{ width: `${Math.min(progress, 100)}%` }} />
              {/* Seek thumb */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${brandBar[brand]} ${isDragging ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'} transition-all shadow-sm`}
                style={{ left: `calc(${Math.min(progress, 100)}% - 8px)` }}
              />
            </div>
            <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground transition-colors">
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <span className="text-xs text-muted-foreground font-medium tabular-nums">{formatTime(elapsed)} / {formatTime(displayDuration)}</span>
          </div>
          {tts.error && (
            <p className="text-destructive text-xs mt-2">{tts.error}</p>
          )}
        </div>
      </div>

      {/* Full transcript always visible */}
      <div className="mt-4 p-4 bg-secondary/50 rounded-xl border border-border max-h-40 overflow-y-auto scrollbar-thin">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Transcript</p>
        <p className="text-xs text-muted-foreground/80 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );
}
