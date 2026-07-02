import type { ContentBlock } from './readingContent';

export const READING_CONTENT_WEEK2: Record<string, ContentBlock[]> = {
  // ===== DAY 6: WHEN TO CLOSE: BUYING SIGNALS & CUES =====

  // PHASE 1: The Psychology of the Close
  "6-p1-read": [
    { type: 'heading', text: "The Shift in Ownership" },
    { type: 'paragraph', text: "In MarTech SaaS sales, closing is not a single event at the end of a call. It is a psychological transition where the prospect stops looking at the Referrizer platform as a 'tool' and starts looking at it as 'their business engine.' We categorize these into three distinct signal groups." },
    { type: 'bullets', items: [
      { bold: "Verbal", text: "Specific phrasing shifts. Listen for possessive language, future pacing, and logistics questions." },
      { bold: "Behavioral", text: "On-camera engagement during the demo. Watch for leaning in, unmuting, and feature deep-dives." },
      { bold: "Digital", text: "Post-demo data footprints. Track proposal opens, pricing page revisits, and link clicks." },
    ]},
    { type: 'paragraph', text: "The goal is to identify 'The Shift' in real-time. The moment the prospect transitions from evaluating to envisioning themselves using the platform, you must recognize it and adjust your approach from selling to guiding." },
    { type: 'quote', text: "The ability to close the deal is the single most important skill in selling, everything else leads up to that moment.", author: "Brian Tracy" },
    { type: 'heading', text: "Recognizing The Shift" },
    { type: 'paragraph', text: "The Shift happens when a prospect stops asking IF questions and starts asking HOW questions. 'Does Referrizer integrate with my POS system?' is evaluation. 'How do I set up the check-in kiosk at my front desk?' is ownership. The difference is subtle but critical. IF questions test whether the product works. HOW questions test how it works for THEIR specific business." },
    { type: 'callout', text: "When you hear HOW questions, stop your pitch. The prospect has mentally bought the product. Your job now is to guide them through the logistics of getting started.", icon: "🎯" },
  ],

  // PHASE 2: Decoding Digital Body Language
  "6-p2-read": [
    { type: 'heading', text: "Remote Behavioral Signals" },
    { type: 'paragraph', text: "In a 100 percent remote environment, we rely on 'Screen Engagement.' Traditional body language cues are limited, so you must become an expert at reading digital signals both during and after the call." },
    { type: 'heading', text: "During the Call" },
    { type: 'bullets', items: [
      { bold: "The Lean-In", text: "Physical movement toward the webcam during ROI discussions or when you show the Reputation Management dashboard. When a prospect moves closer to their screen, they are literally leaning into the sale." },
      { bold: "The Unmute", text: "Frequent unmuting signals an urge to participate rather than just listen. A prospect who stays muted is passive. A prospect who keeps unmuting to ask questions is engaged and interested." },
      { bold: "Feature Deep-Dives", text: "When a prospect asks you to click into the Reputation Management dashboard to see how a review request is triggered after a check-in, they are 'test driving' the software. This is the equivalent of picking up merchandise in a store." },
      { bold: "Screen Sharing Requests", text: "If a prospect asks you to go back to the Loyalty Program setup or asks to see how the Smart Inbox works for two-way texting, they are mentally configuring the product for their business." },
    ]},
    { type: 'heading', text: "After the Call" },
    { type: 'paragraph', text: "Post-call, watch for high 'Proposal Velocity' where a prospect opens your pricing link more than 3 times in 24 hours. This is one of the strongest digital buying signals. Track email opens, link clicks, and page time on your proposals." },
    { type: 'table', headers: ["Signal", "What It Means", "Your Move"], rows: [
      ["3+ pricing link opens in 24 hours", "High intent, comparing options internally", "Call immediately with a specific question"],
      ["Forwards proposal to another email", "Stakeholder expansion in progress", "Offer an alignment call with both parties"],
      ["Opens proposal at 10 PM on a Sunday", "Thinking about it on their own time", "Send a personalized follow-up Monday morning"],
      ["Visits referrizer.com after the demo", "Doing additional research, validating", "Send a relevant case study for their vertical"],
    ]},
  ],

  // PHASE 3: Verbal Masterclass
  "6-p3-read": [
    { type: 'heading', text: "High-Intent Verbal Cues" },
    { type: 'paragraph', text: "Master the 'Possessive Shift.' Listen for the change from 'your software' to 'our Referrizer account.' This single pronoun swap reveals that the prospect has mentally taken ownership of the product." },
    { type: 'heading', text: "Key Verbal Signal Categories" },
    { type: 'bullets', items: [
      { bold: "Future Pacing", text: "'This will save my front desk 5 hours a week on review follow-ups and loyalty tracking.' The prospect is projecting themselves into a future where they already use the product." },
      { bold: "Cost of Inaction", text: "'If we do not start collecting reviews before the spring season, our competitors will bury us on Google.' They are quantifying the pain of NOT buying." },
      { bold: "Price Justification", text: "Questions about annual vs monthly billing or ROI proof. When they ask about payment structures, they have already decided to buy and are now optimizing the terms." },
      { bold: "Implementation Questions", text: "'How long does onboarding take?' 'Can my receptionist manage the check-in tablet?' These logistics questions signal intent to purchase." },
    ]},
    { type: 'quote', text: "The first person to justify the price closes the deal.", author: "Jeffrey Gitomer" },
    { type: 'heading', text: "The Pronoun Map" },
    { type: 'table', headers: ["What They Say", "Signal Strength", "Your Response"], rows: [
      ["'Your software does X'", "Low. Still evaluating.", "Continue demo, build more value."],
      ["'This could work for us'", "Medium. Interested but not committed.", "Ask a trial close question."],
      ["'When we set up our account...'", "High. They have mentally bought.", "Transition to logistics and close."],
      ["'Our customers will love the loyalty rewards'", "Very High. Selling internally already.", "Go assumptive immediately."],
    ]},
  ],

  // PHASE 4: Trial Closing Techniques
  "6-p4-read": [
    { type: 'heading', text: "The Art of the Micro-Close" },
    { type: 'paragraph', text: "A Trial Close is a temperature check used to confirm agreement on a specific value point. It prevents 'sticker shock' at the end of the demo. Use open-ended questions that link the feature back to their specific pain." },
    { type: 'heading', text: "How Trial Closes Work" },
    { type: 'paragraph', text: "After showing a feature, ask: 'Can you see how getting 10 new five-star reviews in the first 30 days would change your Google ranking?' If they say yes, you have a micro-commitment. Accumulate 3 to 5 of these throughout the call to make the final close feel like the next logical step." },
    { type: 'heading', text: "Trial Close Scripts by Feature" },
    { type: 'table', headers: ["Feature Shown", "Trial Close Question"], rows: [
      ["Reputation Management", "'Can you see how getting 10 new reviews in 30 days would change your Google ranking?'"],
      ["Loyalty Program", "'If your customers were earning points and coming back more often, how would that impact your monthly revenue?'"],
      ["Referral Program", "'If each customer referred just one friend, can you see how quickly your customer base would grow?'"],
      ["SMS / Text Marketing", "'Would automated text campaigns for birthdays, win-backs, and promotions save your team significant time?'"],
      ["AI Assistant", "'If leads were getting instant responses at 2 AM and booking themselves, how many more appointments would you capture?'"],
      ["Check-in System", "'If every visit automatically triggered a review request, loyalty points, and a referral prompt, can you see how that compounds over time?'"],
    ]},
    { type: 'callout', text: "The key to trial closes: never ask a yes/no question about the product itself. Always tie the question to THEIR specific business outcome. You are not asking 'Do you like this feature?' You are asking 'Can you see how this solves YOUR problem?'", icon: "💡" },
    { type: 'heading', text: "The Stacking Effect" },
    { type: 'paragraph', text: "Each micro-commitment builds on the last. By the time you reach the final close, the prospect has already said 'yes' three to five times. The final close is simply: 'Based on everything we have agreed on today, let us get you started.' It feels natural, not forced." },
  ],

  // PHASE 5: Navigating the Buying Committee
  "6-p5-read": [
    { type: 'heading', text: "Stakeholder Expansion" },
    { type: 'paragraph', text: "In MarTech, 'Consensus Buying' is common. When a prospect says 'I need my manager to see the Reputation Management results you showed me,' it is a massive signal of intent. They want to buy. They just need internal buy-in." },
    { type: 'heading', text: "Champion vs. Economic Buyer" },
    { type: 'bullets', items: [
      { bold: "Champion (The User)", text: "The person who will USE the product daily. They are sold on the features and the value. They want this to happen." },
      { bold: "Economic Buyer (The Budget Holder)", text: "The person who writes the checks. They care about ROI, cost justification, and business impact. They may never see the demo." },
    ]},
    { type: 'callout', text: "Never let your Champion sell for you. They will not position the product as well as you can. Offer a 'Joint Action Plan' to present the value to the second stakeholder together.", icon: "⚠️" },
    { type: 'heading', text: "The Alignment Call Framework" },
    { type: 'steps', steps: [
      { step: "Acknowledge", description: "'That makes perfect sense. Important decisions should be made together.'" },
      { step: "Surface the Concern", description: "'If your partner were here right now, what do you think their biggest question would be?'" },
      { step: "Address It Now", description: "Handle the anticipated concern on the spot so your Champion is armed with the answer." },
      { step: "Propose the Call", description: "'Rather than have you explain everything, can we schedule a quick 15-minute alignment call with both of you?'" },
      { step: "Prepare Materials", description: "Create a one-page ROI summary customized for their business to send before the call." },
    ]},
    { type: 'quote', text: "No one is really served until you close the deal.", author: "Grant Cardone" },
  ],

  // PHASE 6: Mastery & Elite Frameworks
  "6-p6-read": [
    { type: 'heading', text: "The Pro Closer Framework" },
    { type: 'paragraph', text: "To reach 100/100 mastery at Referrizer, we combine elite methodologies. Each framework adds a unique lens to your closing ability." },
    { type: 'bullets', items: [
      { bold: "Gap Selling", text: "Focus on the 'Future State' of their business. Quantify the gap between where they are now and where they could be with Referrizer. The bigger the gap, the easier the close." },
      { bold: "The Challenger Sale", text: "Disrupt their current manual habits. Teach them something they did not know about their own business. When you change how they think, you change how they buy." },
      { bold: "Winning by Design", text: "Focus on the impact of recurring revenue. Position Referrizer not as a monthly expense but as a revenue engine that compounds over time." },
    ]},
    { type: 'paragraph', text: "We close on the vision of the business running on autopilot via Referrizer. The prospect should see a future where check-ins trigger automated review requests, loyalty points accumulate and drive repeat visits, referral campaigns generate new customers organically, and the AI Assistant handles leads 24/7 while they sleep." },
    { type: 'quote', text: "Your competition is not other companies, it is the status quo.", author: "Winning by Design" },
    { type: 'heading', text: "The Status Quo Trap" },
    { type: 'paragraph', text: "Most prospects will not leave you for a competitor. They will leave you for inaction. The status quo is comfortable, familiar, and requires zero effort. Your job is to quantify the cost of staying the same." },
    { type: 'table', headers: ["Current State", "Cost of Inaction", "Future State with Referrizer"], rows: [
      ["No review strategy", "Competitors add 15+ reviews per month while you stagnate", "10x Review Guarantee: 10 new 5-star reviews in 30 days"],
      ["No loyalty program", "67% of customers never return after first visit", "Automated loyalty drives 3x repeat visits with points and rewards"],
      ["Manual follow-ups via sticky notes", "80% of follow-ups never happen, leads go cold", "Automated SMS/email campaigns trigger after every check-in"],
      ["No referral system", "Customers leave happy but never tell anyone", "Referral program turns every satisfied customer into a lead generator"],
      ["No after-hours lead capture", "50%+ of inquiries come outside business hours", "AI Assistant responds instantly 24/7 and books appointments automatically"],
    ]},
    { type: 'callout', text: "Mastery means you do not use a script, you use a framework. The frameworks become muscle memory. You read the room, choose the right approach, and execute with conviction.", icon: "🏆" },
  ],

  // DAY 7/8: 1-to-Many Group Demo Excellence (from Demo Excellence SOP)
  "7-group-demo": [
    { type: 'heading', text: "1-to-Many Group Demo Excellence" },
    { type: 'paragraph', text: "Group demos (webinars, lunch-and-learns, trade show presentations) require a completely different approach than 1-on-1 demos. You are no longer having a conversation. You are delivering a performance. The scoring system below ensures every group demo drives maximum conversions." },
    { type: 'heading', text: "Group Demo Scoring (100 Points)" },
    { type: 'table', headers: ["Component", "Points", "What It Measures"], rows: [
      ["Value Exchange Contract", "15", "Opening the session by explicitly stating what attendees will receive (insights, tools, strategies) in exchange for their time and attention"],
      ["Status Quo Disruption / Rational Drowning", "20", "Using data and reframes to make the audience's current manual processes feel unacceptable. The audience must feel the cost of inaction before you present the solution"],
      ["Symptom-Based Value Routing", "10", "Matching specific Referrizer features to the specific pains expressed by the audience. No generic demos. Every feature shown must connect to a stated symptom"],
      ["The 4-Minute Pulse", "15", "Every 4 minutes, pause for engagement: poll, question, raise-of-hands, chat prompt. Passive audiences do not buy. Active audiences close themselves"],
      ["Social Proof & Community Validation", "10", "Case studies, testimonials, and live data from businesses similar to the audience. Geographic and vertical specificity increases conversion"],
      ["The Frictionless Tiered Close", "15", "Present 3 tiers (Good/Better/Best) with a clear recommendation. Offer a limited-time incentive for same-day sign-ups. Make the next step simple: 'Click the link in the chat'"],
      ["Execution Metrics", "15", "Talk time ratio for webinars: 60-65% presenter, 35-40% audience interaction. Energy, pacing, and visual quality of slides/screen share"],
    ]},
    { type: 'heading', text: "The Value Exchange Contract" },
    { type: 'paragraph', text: "Open every group session with: 'In the next 30 minutes, I am going to show you 3 things: (1) why your competitors are outranking you on Google, (2) the exact system that generates 10+ five-star reviews in 30 days, and (3) how to turn every happy customer into a referral machine. In exchange, I ask for your attention and honest feedback.' This creates a social contract that keeps the audience engaged." },
    { type: 'heading', text: "The 4-Minute Pulse" },
    { type: 'paragraph', text: "Every 4 minutes, inject an engagement element. Examples: 'Raise your hand if you have ever lost a customer to a competitor with more Google reviews.' 'Type in the chat: how many reviews does your business have right now?' 'Quick poll: do you currently have a loyalty program?' These pulses prevent passive viewing and create data you can use in your follow-up." },
    { type: 'callout', text: "Group demos that use the 4-Minute Pulse see 3x higher same-day conversion rates compared to straight presentations. The audience sells themselves through participation.", icon: "📊" },
  ],

  // ===== DAY 7: THE ULTIMATE FINISHER: REFERRIZER CLOSING =====

  // SET 1: The Direct Path (Happy Path Closes)
  "7-p1-read": [
    { type: 'heading', text: "The Direct Path: Confidence Transfers" },
    { type: 'paragraph', text: "The most important thing to understand about direct closes is this: your confidence transfers directly to the buyer. When you assume the sale, you are not being pushy. You are being a guide. The prospect came to you because they have a problem. You have the solution. Leading them to sign up is an act of service." },
    { type: 'heading', text: "The Assumptive Close" },
    { type: 'quote', text: "I have everything ready to sign you up so we can get your campaigns live!" },
    { type: 'bullets', items: [
      { bold: "When confidence is high", text: "Use this when the prospect has shown strong buying signals and agreement throughout the demo." },
      { bold: "To bypass minor hesitations", text: "Maintain momentum and skip the 'asking for permission' phase, assuming the sale is already made." },
      { bold: "With busy owners", text: "Local business owners appreciate efficiency. Assuming the close saves them from making a formal decision." },
    ]},
    { type: 'heading', text: "The Next Steps Direct Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "It sounds like Referrizer is exactly what you need to solve your retention issue. The next step is simply to choose your plan, grab your billing details, and get your onboarding scheduled. Which card would you like to use?" },
    ]},
    { type: 'bullets', items: [
      { bold: "When the demo went flawlessly", text: "Don't overcomplicate it. If they love it, tell them exactly what to do next." },
      { bold: "To project ultimate confidence", text: "Leading the prospect with authority puts them at ease." },
      { bold: "To eliminate awkward pauses", text: "It bridges the gap between the pitch and the transaction seamlessly." },
    ]},
    { type: 'heading', text: "The If-Then Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "If I can show you how Referrizer will generate enough new clients to pay for itself in the first 90 days, then are you willing to move forward today?" },
    ]},
    { type: 'bullets', items: [
      { bold: "At the beginning of the demo", text: "Sets a clear expectation for the outcome of the meeting." },
      { bold: "To weed out non-buyers", text: "If they say no to this, you know they aren't authorized to buy or have zero intention of buying." },
      { bold: "To secure a conditional yes", text: "It lowers their guard because the 'yes' is contingent on you proving your claims. Time to get to work!" },
    ]},
    { type: 'heading', text: "The Question Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "In terms of setting up your loyalty program and getting these text campaigns running, does it make sense to get started today?" },
    ]},
    { type: 'bullets', items: [
      { bold: "Soft, low-pressure", text: "'Does it make sense' is one of the highest-converting, lowest-friction phrases in sales." },
      { bold: "Consultative, not pushy", text: "It feels like advice rather than a sales pitch." },
      { bold: "Invites objections naturally", text: "If they say 'no,' it naturally prompts 'Okay, what part doesn't make sense?'" },
    ]},
    { type: 'callout', text: "The Direct Path closes work best when you have earned the right to lead. That right is earned through thorough discovery, genuine empathy, and a demo that connects every feature to their specific pain.", icon: "🎯" },
  ],

  // SET 2: The Logic Gate (Frameworks for the Analytical)
  "7-p2-read": [
    { type: 'heading', text: "The Logic Gate: Bypassing Analysis Paralysis" },
    { type: 'paragraph', text: "Some prospects will never buy on emotion. They need data, structure, and a logical framework to feel comfortable making a decision. These closes give them exactly that, a structured path to yes." },
    { type: 'heading', text: "The 1-10 Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "On a scale from 1 to 10, 10 meaning that we can go forward with setting up your Referrizer account today, where would you say we are?" },
      { speaker: "Prospect", text: "Maybe a 7." },
      { speaker: "You", text: "Great. What would it take to make that 7 a 10 right now?" },
    ]},
    { type: 'bullets', items: [
      { bold: "To gauge temperature", text: "Use this when you are unsure where the prospect stands and need a quantifiable metric." },
      { bold: "To isolate objections", text: "If they say '7,' you immediately follow up to uncover their hidden objection." },
      { bold: "To transition to a logical close", text: "It forces the prospect to rationalize their hesitation, allowing you to solve the final missing pieces." },
    ]},
    { type: 'heading', text: "The Ben Franklin (Weigh the Facts) Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "Let's take a sheet of paper and draw a line down the middle. On the left, we write 'yes' and the reasons favoring Referrizer, and on the right, 'no' and the reasons opposing it. Let's see what happens." },
    ]},
    { type: 'paragraph', text: "ALWAYS start with them going first and detailing all of the negatives. Give them plenty of time. Then when you switch to positive, let them go first so they feel in control, then add one. Let them add another, and you add another. The back and forth emphasis on the positive makes them feel united on the decision. A wrap-up statement like 'Looks like we have a decision now!' will bring relief, since decision-making for analytical types can be stressful and mentally taxing." },
    { type: 'heading', text: "The Alternate Choice Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "[Name], you have agreed that Referrizer meets your needs with its automated texting and referral tracking. As I see it, we just need to decide whether to start you off with or without the Platinum Plan." },
    ]},
    { type: 'bullets', items: [
      { bold: "Illusion of control", text: "You aren't asking if they want to buy, you are asking which option they want to buy. Two 'yes' options." },
      { bold: "After a successful trial close", text: "Use right after they admit the software solves their problems." },
      { bold: "To cement next steps", text: "It locks down a firm commitment on the calendar for implementation." },
    ]},
    { type: 'heading', text: "The Basic Written Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "I like to organize my thoughts and write down notes so I don't forget any of the specific Referrizer features you need, particularly anything that would cost you time or money. Isn't that fair?" },
    ]},
    { type: 'callout', text: "When the prospect is defensive about 'signing anything,' the Basic Written Close frames the agreement as a protective checklist for the client, not a trap.", icon: "📋" },
  ],

  // SET 3: The ROI Shield (Defending Price & Budget)
  "7-p3-read": [
    { type: 'heading', text: "The ROI Shield: The Math of Referrizer" },
    { type: 'paragraph', text: "Price objections are the most common objections in sales. But here is the truth: a price objection is almost always a value objection in disguise. If the prospect truly understood the ROI, the price would feel small. These four closes turn an expense into an investment." },
    { type: 'heading', text: "Create the Value Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "Years ago, Referrizer had a decision to make. Do we cut corners and make a cheap tool, or do we invest in high-quality automation and only have to explain the price once? We chose to invest in quality, so we only explain the price once. Do you think we made the right decision?" },
    ]},
    { type: 'bullets', items: [
      { bold: "When facing cheaper competitors", text: "Changes the conversation from 'cost' to 'quality and reliability.'" },
      { bold: "To trap them in a logical agreement", text: "By getting them to agree that quality is better, they naturally have to agree to your price." },
      { bold: "Great isolation point", text: "This is a great place for isolation, a discussion on value, and referring to companies that switched to Referrizer." },
    ]},
    { type: 'heading', text: "Reduce to the Ridiculous" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "You said $150 a month is too much. But divided by 30 days, that's $5 a day. You couldn't pay an employee $5 a day to automatically text your clients, track referrals, and capture leads, could you? Does this entire solution provide the value of one coffee per day?" },
    ]},
    { type: 'heading', text: "Cost Too Much Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "The cost of Referrizer is directly related to the savings and revenue it brings in. The platform will produce the new business that would more than justify its investment, wouldn't you agree?" },
    ]},
    { type: 'paragraph', text: "When you do a thorough job detailing the ROI during the qualification opening, this objection can be avoided or easily handled, as ROI financial factoring is solidly implanted in short-term memory. Attempting to do the math now can seem desperate and tactical. Doing it earlier is strategic and prevents the prospect from rationalizing price." },
    { type: 'heading', text: "Not in the Budget Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "I understand you have a planned budget. As the owner of a successful company, you retain the right to flex that budget in the interest of your company's financial present and competitive future, isn't that correct?" },
    ]},
    { type: 'bullets', items: [
      { bold: "The budget smokescreen", text: "'No budget' usually means 'no value.' This challenges their authority to make a decision." },
      { bold: "Ego stroke", text: "For certain ego types, saying no would mean they are not successful and do not care about their future." },
      { bold: "Focus on the future", text: "Frames the purchase as necessary for survival against local competitors." },
    ]},
    { type: 'callout', text: "Never negotiate on price. Increase the proof. Widen the gap. Make the investment look small compared to the cost of doing nothing.", icon: "🛡️" },
  ],

  // SET 4: The Emotional Lever (Urgency & FOMO)
  "7-p4-read": [
    { type: 'heading', text: "The Emotional Lever: Tapping Into the Fear of Staying the Same" },
    { type: 'paragraph', text: "Logic makes people think. Emotion makes people act. These four closes tap into the most powerful human motivators: empathy, fear of regret, urgency, and the pain of inaction." },
    { type: 'heading', text: "Feel, Felt, Found Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "I can appreciate the way you feel. John at ABC Spa felt exactly the way you do about experiencing immediate value. What he found was that Referrizer's automated reputation campaigns gave him a dozen five-star reviews the first month. Can't you see how this will benefit you the same way?" },
    ]},
    { type: 'bullets', items: [
      { bold: "When facing skepticism", text: "Use when a prospect doubts the platform will work for them and you have a valid counter-claim." },
      { bold: "Social proof", text: "Shifts the burden of proof to a successful, relatable peer." },
      { bold: "Validates their emotion", text: "Shows empathy ('I understand') rather than immediately arguing." },
    ]},
    { type: 'heading', text: "The Wish Ida Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "We're all members of the 'Wish Ida' club. 'Wish Ida started building a referral list sooner.' 'Wish Ida been doing something with my massive contact list.' 'Wish Ida been putting more time and energy into building an awesome website.' Wouldn't it be great to get rid of a potential 'Wish Ida' by saying yes to something you really want today?" },
    ]},
    { type: 'heading', text: "The Cost of Inaction Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "We know what it costs to implement Referrizer today. But what is it going to cost you in lost revenue over the next 6 months if you continue to let your current customers walk out the door without a loyalty program?" },
    ]},
    { type: 'bullets', items: [
      { bold: "Re-frames the risk", text: "Makes the risk of doing nothing seem far greater than the risk of buying." },
      { bold: "When they want to wait", text: "Proves that waiting is actually costing them money every single day." },
      { bold: "Creates internal emotional pain", text: "Forces the owner to look at the holes in their own business bucket." },
    ]},
    { type: 'heading', text: "The Imminent Doom (Urgency) Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "In order for me to guarantee the $500 setup credit and the promotional pricing we discussed, we need to get you signed up today or you will lose both program incentives." },
    ]},
    { type: 'bullets', items: [
      { bold: "For procrastinators", text: "Use when a prospect loves the product but lacks the urgency to pull the trigger." },
      { bold: "End of month/quarter", text: "Perfect for tying a close to an expiring company promotion." },
      { bold: "To force a definitive answer", text: "Prevents the sales cycle from dragging out indefinitely." },
    ]},
    { type: 'callout', text: "The key to all emotional closes is tone: they must be delivered with empathy, conviction, and a genuine desire to become the prospect's long-term business partner.", icon: "❤️" },
  ],

  // SET 5: Advanced Tactics (The Pivot & The Takeaway)
  "7-p5-read": [
    { type: 'heading', text: "Advanced Tactics: Mastering the Pivot" },
    { type: 'paragraph', text: "These are the closes that separate good reps from world-class closers. They require confidence, timing, and psychological awareness. Used correctly, they can save deals that every other technique would lose." },
    { type: 'heading', text: "The I'll Think It Over Close" },
    { type: 'script', label: "Full Script", lines: [
      { speaker: "Prospect", text: "I need to think it over." },
      { speaker: "You", text: "I can appreciate that you want to think it over. Of course, you wouldn't take the time to think it over unless you were seriously interested in growing with Referrizer, would you?" },
      { speaker: "You", text: "Just to clarify, is it the monthly investment?" },
      { speaker: "Prospect", text: "Yeah, it's the price." },
      { speaker: "You", text: "Other than the price, is there any other reason why we couldn't get you signed up tonight?" },
    ]},
    { type: 'paragraph', text: "This puts them in a psychological corner and gives you one thing to focus on to close. Tread lightly once you have isolated the objection. The prospect has given you an opening, not an invitation to steamroll." },
    { type: 'heading', text: "The Sharp Angle Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "Prospect", text: "Can we get our first email campaign out by next Friday?" },
      { speaker: "You", text: "If I can guarantee your campaign is live by next Friday for email, will we go forward with the agreement today?" },
    ]},
    { type: 'bullets', items: [
      { bold: "When they ask for a concession", text: "Anytime the prospect asks for something special, faster setup, a discount, an extra feature." },
      { bold: "To test seriousness", text: "If they want the concession, they must pay for it with their business." },
      { bold: "Creates instant commitment", text: "It creates a binding verbal contract on the spot." },
    ]},
    { type: 'heading', text: "The Takeaway Close" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "Honestly, based on your current lead volume, Referrizer might not be the right fit for you right now. We only want to partner with businesses that are ready to handle an influx of referrals." },
    ]},
    { type: 'bullets', items: [
      { bold: "With arrogant or difficult prospects", text: "Triggers their psychological desire for what they are told they cannot have. Be careful to avoid being confrontational." },
      { bold: "Establishes massive authority", text: "Shows you are an expert diagnosing a problem, not a beggar looking for a commission." },
      { bold: "When the deal is stalling", text: "Pulling away forces the prospect to either chase you or let the deal die cleanly. If someone won't chase you after this, they were never going to buy." },
    ]},
    { type: 'callout', text: "World-class best practice: Always isolate the objection first. Ask: 'Other than [money/time], is there any other reason why we couldn't go forward today?' The 1-Minute Rule: ask for the 'one minute version' of their current process to pull out the pain. No hesitation: speak with no ums or pauses to project authority.", icon: "🏆" },
    { type: 'heading', text: "Master Summary: The 6-Step Objection Handling Method" },
    { type: 'steps', steps: [
      { step: "Hear Them Out", description: "Actually listen. Do not prepare your rebuttal while they are talking." },
      { step: "Rephrase It", description: "Prove you heard them by feeding their words back in your own words." },
      { step: "Isolate It", description: "'Other than this, is there anything else preventing us from moving forward?'" },
      { step: "Handle It", description: "Now and ONLY now, address the concern with value, proof, or reframe." },
      { step: "Confirm", description: "'Does that address your concern?' Make sure you handled it." },
      { step: "Roll On", description: "Transition immediately back to the close. No awkward pauses. No celebration. Just smooth momentum." },
    ]},
  ],

  // ===== DAY 8: SALES PSYCHOLOGY & MINDSET =====

  // PHASE 1: The Influence Blueprint (Social Proof + Reciprocity)
  "8-p1-read": [
    { type: 'quote', text: "95% of people are imitators and only 5% initiators... people are persuaded more by the actions of others than by any proof we can offer.", author: "Robert Cialdini" },
    { type: 'heading', text: "Social Proof: The Bandwagon Effect" },
    { type: 'paragraph', text: "Humans are neurobiologically wired to follow the lead of others, especially 'similar others,' to reduce the perceived risk of a decision. In the amygdala, the fear of making a wrong choice is mitigated when we see others in our 'tribe' succeeding with a tool. This is not weakness, it is evolution." },
    { type: 'heading', text: "Application to Referrizer Sales" },
    { type: 'paragraph', text: "When speaking to a Yoga Studio owner, never just list features. Instead say: 'Other studios in your ZIP code saw a 30% increase in repeat bookings within 60 days of activating our referral module.' The specificity, the geographic proximity, the timeframe, these are what trigger the Bandwagon Effect." },
    { type: 'callout', text: "The Case Study Roleplay: practice weaving a 'Success Story' into every objection. If the prospect says 'It is too expensive,' respond with a story of a client who had the same concern but saw exponential ROI.", icon: "🎯" },
    { type: 'heading', text: "The Rule of Reciprocity" },
    { type: 'quote', text: "We are obligated to the future repayment of favors, gifts, invitations, and the like.", author: "Robert Cialdini" },
    { type: 'paragraph', text: "When someone does something for us, we feel a deep internal obligation to repay the debt. This creates a 'social debt' in the prefrontal cortex that causes discomfort until the debt is settled." },
    { type: 'heading', text: "Value-First Prospecting" },
    { type: 'paragraph', text: "Provide a 'Free Local SEO Audit' or a 'Google Review Health Check' during the first call with no strings attached. By giving value first, the prospect is psychologically more inclined to give you their time for a full demo." },
    { type: 'bullets', items: [
      { bold: "Gift of Insight", text: "Send helpful articles or specific business tips to prospects BEFORE asking for a meeting. Lead with generosity." },
      { bold: "Free Competitive Analysis", text: "Show them how their Google profile compares to their top 3 local competitors. Give this away." },
      { bold: "The Reciprocity Loop", text: "Value given freely creates obligation. Obligation creates openness. Openness creates demos. Demos create closes." },
    ]},
    { type: 'callout', text: "The most powerful sales move is not a close, it is a gift. Give first, give generously, and watch how the dynamic shifts.", icon: "🎁" },
  ],

  // PHASE 2: The Fear Engine (Loss Aversion + Cost of Inaction)
  "8-p2-read": [
    { type: 'quote', text: "Losses loom larger than gains.", author: "Daniel Kahneman" },
    { type: 'heading', text: "Loss Aversion: Prospect Theory" },
    { type: 'paragraph', text: "The pain of losing is psychologically twice as powerful as the joy of gaining. This is rooted in evolutionary survival. Avoiding a predator was more important than finding a slightly better fruit tree. Your prospects' brains operate on the same wiring." },
    { type: 'heading', text: "Reframing Gain as Loss" },
    { type: 'paragraph', text: "Instead of saying 'You will gain 50 new leads,' say: 'Right now, you are losing 50 potential referrals every month because your current customers have no automated way to spread the word. That is $5,000 in leaking revenue every month.'" },
    { type: 'callout', text: "Never lead with what they will GAIN. Lead with what they are LOSING. The brain processes loss 2x more intensely than gain. This is not manipulation, it is neuroscience.", icon: "🧠" },
    { type: 'heading', text: "The Leaky Bucket Audit" },
    { type: 'paragraph', text: "Train yourself to perform a 'Gap Analysis' during every demo. Identify exactly how much money the business is currently losing by not having reputation management, automated follow-ups, or a referral system." },
    { type: 'table', headers: ["What They Are Missing", "Monthly Revenue Leak", "Annual Impact"], rows: [
      ["No automated review requests", "20-40 lost reviews/month", "$12,000-$24,000 in lost trust-driven revenue"],
      ["No loyalty program", "30% customer churn", "$18,000-$36,000 in lost repeat business"],
      ["No referral system", "50+ missed referrals/month", "$30,000-$60,000 in lost new customers"],
      ["No win-back campaigns", "40% of past customers gone forever", "$24,000-$48,000 in abandoned revenue"],
    ]},
    { type: 'heading', text: "The Cost of Inaction Close" },
    { type: 'paragraph', text: "Ask: 'We know what it costs to implement Referrizer today. But what is it going to cost you in lost revenue over the next 6 months if you continue to let your current customers walk out the door without a loyalty program?' This reframes the risk of doing nothing as far greater than the risk of buying." },
    { type: 'quote', text: "People don't buy for logical reasons. They buy for emotional reasons.", author: "Zig Ziglar" },
  ],

  // PHASE 3: The Decision Architect (Paradox of Choice + Anchoring + Framing)
  "8-p3-read": [
    { type: 'quote', text: "Learning to choose is hard. Learning to choose well is harder. And learning to choose well in a world of unlimited possibilities is harder still.", author: "Barry Schwartz" },
    { type: 'heading', text: "The Paradox of Choice" },
    { type: 'paragraph', text: "Providing too many options leads to 'analysis paralysis.' When faced with too many choices, the brain often chooses 'nothing.' Excessive choices increase cognitive load, leading to decision fatigue and buyer's remorse." },
    { type: 'heading', text: "The Rule of Three" },
    { type: 'paragraph', text: "Never present more than three options or packages. Use the 'Good, Better, Best' framework to guide the prospect toward the middle 'sweet spot.' Referrizer has many features: Referrals, Reviews, Loyalty Programs, Email, SMS. An AE should NOT demo all of them. Identify the one biggest pain point and offer a targeted solution." },
    { type: 'callout', text: "If you show everything, you sell nothing. Be a sniper, not a shotgun. Present 3 options maximum and let the prospect feel in control of a simplified decision.", icon: "🎯" },
    { type: 'heading', text: "Anchoring Bias" },
    { type: 'paragraph', text: "The first piece of information offered, the 'anchor,' sets the mental benchmark for everything that follows. The brain uses the initial number as a reference point to judge the 'value' of subsequent numbers." },
    { type: 'heading', text: "The Price Framing Drill" },
    { type: 'paragraph', text: "Practice 'top-down' selling. Mention that a typical full-service marketing agency costs $3,000/month. When you later reveal Referrizer is only $200 to $500/month, the price feels like a bargain rather than a cost." },
    { type: 'steps', steps: [
      { step: "Anchor High", description: "Mention the enterprise or agency equivalent price first: '$3,000/month is what most marketing agencies charge for a fraction of what Referrizer delivers.'" },
      { step: "Reveal Your Price", description: "After the anchor is set, reveal Referrizer's pricing. The contrast makes it feel like a steal." },
      { step: "Reinforce with ROI", description: "Show that Referrizer pays for itself with a single new customer per month. The price becomes irrelevant." },
    ]},
    { type: 'heading', text: "The Framing Effect" },
    { type: 'quote', text: "It is not what you say, it is how you say it." },
    { type: 'paragraph', text: "The way information is presented significantly impacts how it is processed. Positive framing emphasizes benefits, negative framing emphasizes risks. The best closers use BOTH strategically: negative framing during discovery to amplify pain, positive framing during the demo to amplify hope." },
  ],

  // PHASE 4: The Mind Reader (Cognitive Dissonance + Halo Effect + Authority)
  "8-p4-read": [
    { type: 'quote', text: "Expertise is the most neutral and most persuasive form of authority." },
    { type: 'heading', text: "The Authority Principle (Expert Bias)" },
    { type: 'paragraph', text: "People have a deep-seated tendency to obey and trust figures of authority. We are taught from childhood to trust doctors, teachers, and experts to save time on processing information. Your job is to sound like a 'Local Growth Consultant,' not a 'salesperson.'" },
    { type: 'bullets', items: [
      { bold: "Industry Jargon", text: "Use terms like 'Churn rate,' 'LTV,' 'GMB Optimization' naturally. This establishes you as an expert in the MarTech space, not a vendor reading a script." },
      { bold: "Vertical Knowledge", text: "An AE who understands the economics of a gym is an authority. An AE who only knows 'how to send SMS' is a vendor." },
      { bold: "Diagnosis, Not Prescription", text: "Doctors diagnose before they prescribe. You must diagnose the business pain before you prescribe Referrizer." },
    ]},
    { type: 'heading', text: "The Halo Effect" },
    { type: 'quote', text: "First impressions never have a second chance." },
    { type: 'paragraph', text: "If we like one aspect of a person or brand, we tend to have a positive predisposition toward everything else they do. The brain uses mental shortcuts to attribute positive traits like honesty and competence to someone based on a single positive trait like professional appearance or a clean website." },
    { type: 'callout', text: "Your LinkedIn profile, your Zoom background, and the quality of the first 30 seconds of the call 'halo' the entire Referrizer software. If YOU are polished, the prospect assumes the SOFTWARE is polished.", icon: "✨" },
    { type: 'heading', text: "Cognitive Dissonance & the Yes-Ladder" },
    { type: 'paragraph', text: "We have an inner drive to keep all our beliefs and behaviors in harmony. If we do something that contradicts our self-image, we feel intense discomfort. AEs can use this by getting the prospect to agree to small 'identity statements' early on." },
    { type: 'quote', text: "The hardest thing to change is a mind that has already made itself up, unless you use their own logic." },
    { type: 'heading', text: "The Yes-Ladder Technique" },
    { type: 'steps', steps: [
      { step: "Identity Question 1", description: "'Do you consider yourself a business owner who is proactive about staying ahead of the competition?' When they say 'Yes,' they commit to that identity." },
      { step: "Identity Question 2", description: "'Would you agree that businesses that invest in customer retention outperform those that only chase new leads?' Another 'Yes' deepens the commitment." },
      { step: "Identity Question 3", description: "'If I showed you a system that automates retention, referrals, and reviews, would you want to see how it works for your specific business?' By now, saying 'No' would contradict their own stated identity." },
    ]},
    { type: 'callout', text: "Ask 3 to 5 small agreement questions early in the demo. This builds a consistency loop that makes the final 'Yes' feel like the only logical conclusion to their previous statements.", icon: "🪜" },
  ],

  // PHASE 5: The Puppet Master (Zeigarnik Effect + EQ + Conviction)
  "8-p5-read": [
    { type: 'heading', text: "The Zeigarnik Effect: Open Loops" },
    { type: 'paragraph', text: "People remember uncompleted or interrupted tasks better than completed ones. An 'open loop' creates mental tension that the brain seeks to resolve. This is the single most underused technique in sales follow-up." },
    { type: 'quote', text: "The brain wants to finish what it starts." },
    { type: 'heading', text: "The Cliffhanger Method" },
    { type: 'paragraph', text: "At the end of a discovery call, say: 'I noticed something very specific about your Google Business Profile that is likely hurting your ranking, but we are out of time. Let us start our next call by looking at that.' This ensures the prospect shows up for the next meeting. Always leave one 'unanswered question' or 'valuable secret' for the next call. This increases show rates for demos dramatically." },
    { type: 'heading', text: "Emotional Intelligence in Sales" },
    { type: 'paragraph', text: "EQ is as important as IQ in sales. Understanding and managing emotions, yours and theirs, is what separates closers from order-takers." },
    { type: 'heading', text: "Mirroring" },
    { type: 'paragraph', text: "Match the prospect's pace, tone, and energy level. If they are analytical and slow, be analytical and slow. If they are high-energy and fast, match it. People trust people who are like them." },
    { type: 'heading', text: "Tonality" },
    { type: 'bullets', items: [
      { bold: "Rising tone at the end", text: "Sounds uncertain, like you are asking permission. Avoid on closing statements." },
      { bold: "Flat or falling tone", text: "Sounds confident and authoritative. Use when stating value and closing." },
      { bold: "Warm, curious tone", text: "Use during probing. Makes them feel safe to share pain." },
    ]},
    { type: 'heading', text: "The Conviction Principle" },
    { type: 'paragraph', text: "In every sales interaction, the person with the most conviction wins. If you are more convinced Referrizer will help them than they are convinced it will not, you will close the deal. Conviction is not volume or aggression, it is deep, quiet certainty." },
    { type: 'callout', text: "The AE must understand that they are not 'selling software,' they are navigating the prospect's neurological shortcuts. If the AE believes they are a 'pestering salesperson,' their sub-communication will trigger the prospect's fight or flight. If the AE believes they are a 'Growth Doctor' prescribing a 'Revenue Cure,' they will project the Authority and Empathy required to bypass skepticism.", icon: "🧠" },
    { type: 'quote', text: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar" },
  ],

  // ===== DAY 9: BUSINESS DEVELOPMENT SKILLS & BEST PRACTICES =====

  // PHASE 1: The High-Ticket Consultative Framework
  "9-p1-read": [
    { type: 'heading', text: "The High-Ticket Consultative Framework" },
    { type: 'quote', text: "You will get all you want in life, if you help enough other people get what they want.", author: "Zig Ziglar" },
    { type: 'paragraph', text: "At Referrizer, we don't just sell 'software.' We provide the Automation Utility for high-ticket service industries. Whether it's an $8,000 HVAC install, a $3,000 roof repair, or a $5,000 annual pet boarding client, you are here to show owners how we turn their daily Check-ins into a 5-star reputation machine." },
    { type: 'heading', text: "The Check-in Trigger in High-LTV Verticals" },
    { type: 'paragraph', text: "In gyms, a check-in is worth $5. In these industries, a check-in represents $500 to $15,000. We sync with their CRM (ServiceTitan, Shopmonkey, Gingr) so that every 'Job Completed' or 'Check-in' triggers a review request and a referral prompt automatically." },
    { type: 'bullets', items: [
      { bold: "Home Services ($463B market)", text: "When the tech closes the ticket in ServiceTitan, Referrizer instantly texts the homeowner for a review before the truck leaves the curb. Average job value: $2,500-$15,000." },
      { bold: "Pet Care ($5.37B)", text: "Identical workflow to gyms but 3x higher ticket prices. Boarding, grooming, training. Gingr and PetExec integrations. ICP Fit: 9.5/10." },
      { bold: "Auto Repair ($380B)", text: "Check-in via Repair Order or LPR scan. $800+ average ticket. Shopmonkey and Tekmetric integrations. ICP Fit: 8/10." },
    ]},
    { type: 'heading', text: "Shifting the Conversation" },
    { type: 'paragraph', text: "Never lead with features. Lead with the outcome. Instead of 'We have SMS marketing,' say: 'When your tech finishes an HVAC install, Referrizer automatically texts the homeowner a review request, a referral link, and a maintenance reminder. All before your tech drives to the next job.'" },
    { type: 'callout', text: "The value proposition for high-LTV verticals is simple: one referred customer in Home Services is worth $5,000-$15,000. The platform pays for YEARS of service with a single referral.", icon: "💰" },
    { type: 'heading', text: "Handling 'We're Too Busy'" },
    { type: 'paragraph', text: "When a business owner says 'We're too busy for marketing,' that is not an objection, it's an opportunity. Pivot to: 'That's exactly why you need Referrizer. Everything is automated. When your tech closes a job, the review request goes out instantly. When a customer refers a friend, they get rewarded automatically. Zero manual effort from you or your team. The busier you are, the more Referrizer works for you.'" },
  ],

  // PHASE 1: Tool Mastery - Apollo.io
  "9-p1-tools": [
    { type: 'heading', text: "Tool Mastery: Apollo.io" },
    { type: 'paragraph', text: "Apollo.io is your precision prospecting engine. It gives you access to 275M+ verified contacts and 73M+ companies. For Referrizer AEs, it means finding the exact decision-maker at every high-LTV local business in your territory." },
    { type: 'callout', text: "Sign up for Apollo.io here: apollo.io/signup", icon: "🔗" },
    { type: 'heading', text: "Training Resources" },
    { type: 'paragraph', text: "Watch the Apollo Academy training plays at apollo.io/academy/plays to master advanced search filters, list building, and sequence automation." },
    { type: 'heading', text: "Key Features for Referrizer AEs" },
    { type: 'bullets', items: [
      { bold: "Hyper-Specific Filters", text: "Filter by industry (HVAC, Pet Care, Auto Repair), location (ZIP code radius), company size, and revenue. Build lists of 200+ qualified prospects in minutes." },
      { bold: "Verified Contact Data", text: "Direct phone numbers and verified emails for business owners, not gatekeepers. Skip the receptionist." },
      { bold: "Sequence Automation", text: "Set up multi-touch email sequences that run automatically. Combine with Loom videos for maximum impact." },
    ]},
    { type: 'heading', text: "Case Studies" },
    { type: 'steps', steps: [
      { step: "Rippling", description: "Used hyper-specific regional filters in Apollo. Result: 3x pipeline growth in 6 months." },
      { step: "Deel", description: "Targeted global HR decision-makers with precision filters. Result: 400% increase in outbound meeting volume." },
      { step: "Census", description: "Leveraged verified email data for cleaner outreach. Result: 40% higher open rates via cleaner lists." },
    ]},
    { type: 'callout', text: "Your Apollo workflow: Filter by vertical + ZIP code, export to a Smart View in Close CRM, then layer in Loom videos and LinkedIn touches for a multi-channel approach.", icon: "🎯" },
  ],

  // PHASE 2: Visual Prospecting & The Review Gap
  "9-p2-read": [
    { type: 'heading', text: "Visual Prospecting & The Review Gap" },
    { type: 'quote', text: "Visuals are processed 60,000 times faster than text." },
    { type: 'paragraph', text: "Owners are visual. The most powerful prospecting tool you have is showing them their 'Review Gap,' the difference between their 20 reviews and their competitor's 200. This is the 'Leaky Bucket' they cannot afford to ignore." },
    { type: 'heading', text: "The Review Gap Method" },
    { type: 'paragraph', text: "Open Google Maps. Search for their business. Screenshot their listing (3.8 stars, 22 reviews). Then search their top competitor (4.7 stars, 247 reviews). Put them side by side. The visual impact is devastating. No words needed." },
    { type: 'heading', text: "The Hook-Gap-CTA Framework" },
    { type: 'steps', steps: [
      { step: "Hook (5 seconds)", description: "'Hey [Name], I just looked at your Google listing and noticed something your competitors are doing that you're not.'" },
      { step: "Gap (20 seconds)", description: "Screen-share their listing vs. the competitor. Point out the review count difference. 'They have 247 reviews. You have 22. Guess who Google shows first?'" },
      { step: "CTA (5 seconds)", description: "'I have a 5-minute demo that shows exactly how to close that gap. Are you free Thursday at 2?'" },
    ]},
    { type: 'heading', text: "Example: Auto Repair Shop" },
    { type: 'paragraph', text: "Record a 60-second Loom video showing an Auto Repair shop's Google listing vs. their competitor. Highlight the missed 'Refer-a-Friend' opportunities on their website. Show the competitor's automated review flow. End with: 'You're losing 10-15 customers a month to this gap. Let me show you how to fix it in under a week.'" },
    { type: 'callout', text: "The best Loom videos are under 90 seconds. Hook them in 5 seconds, show the pain in 20, and close with a specific CTA. Record 10 per day and your pipeline will explode.", icon: "🎥" },
  ],

  // PHASE 2: Tool Mastery - Loom
  "9-p2-tools": [
    { type: 'heading', text: "Tool Mastery: Loom" },
    { type: 'paragraph', text: "Loom is your asynchronous video selling weapon. Personalized screen-capture videos cut through the noise of cold email and stand out in crowded inboxes." },
    { type: 'callout', text: "Sign up for Loom here: loom.com/signup", icon: "🔗" },
    { type: 'heading', text: "Training Resources" },
    { type: 'paragraph', text: "Watch the getting started tutorials at support.atlassian.com/loom/docs/getting-started-loom-video-tutorials/ to master recording, editing, and sharing." },
    { type: 'heading', text: "Best Practices for Sales Videos" },
    { type: 'bullets', items: [
      { bold: "Lighting & Background", text: "Face a window for natural light. Use a clean, professional background or a branded virtual background." },
      { bold: "Webcam Bubble", text: "Keep your face visible in the corner. Eye contact builds trust even in async video." },
      { bold: "Screen Share Focus", text: "Show THEIR business, not your product. Their Google listing, their website, their competitor. Make it about them." },
      { bold: "Subject Lines", text: "Use '[Video] I found something about [Business Name]' format. Video subject lines get 2-3x higher open rates." },
    ]},
    { type: 'heading', text: "Case Studies" },
    { type: 'steps', steps: [
      { step: "HubSpot", description: "Reps sent personalized micro-demo Loom videos. Result: 20%+ higher reply rates on cold outreach." },
      { step: "Atlassian", description: "Swapped intro meetings for async Loom videos. Result: 30% reduction in meeting no-shows." },
      { step: "Brex", description: "Used video recaps for complex deal stages. Result: Shortened sales cycles by an average of 14 days." },
    ]},
  ],

  // PHASE 3: LinkedIn & The Social Wrap-Around
  "9-p3-read": [
    { type: 'heading', text: "LinkedIn & The Social Wrap-Around" },
    { type: 'quote', text: "Your network is your net worth.", author: "Porter Gale" },
    { type: 'paragraph', text: "Owners of high-ticket businesses are active on LinkedIn. Use the 'Social Wrap-Around': Connect, comment on their recent project, and then send your Loom. This makes you a 'familiar advisor,' not a 'cold caller.'" },
    { type: 'heading', text: "The Social Wrap-Around Method" },
    { type: 'steps', steps: [
      { step: "Touch 1: Connect", description: "Send a personalized connection request mentioning something specific. NOT a pitch. 'Saw your post about the new roof you completed on Elm Street. Impressive work!'" },
      { step: "Touch 2: Engage", description: "Like and comment on 2-3 of their posts over the next week. Add genuine value. 'Great tip about seasonal HVAC maintenance. My clients in the home services space see the same trends.'" },
      { step: "Touch 3: Value Drop", description: "Share a relevant article or insight via DM. 'Thought you might find this interesting. 87% of homeowners check Google reviews before hiring a contractor.'" },
      { step: "Touch 4: The Loom", description: "Send your personalized Loom video. 'I recorded a quick 60-second video about your Google listing. Thought you should see this.'" },
      { step: "Touch 5-7: Nurture", description: "Continue engaging with content. Share their posts. Invite them to webinars. Build the relationship before the ask." },
    ]},
    { type: 'heading', text: "Connection Request Templates" },
    { type: 'paragraph', text: "WRONG: 'Hi, I work at Referrizer and I'd love to show you our marketing platform.' RIGHT: 'Hi [Name], I noticed your HVAC company's recent project post. Impressive work! I help home service businesses like yours turn happy customers into 5-star reviews and referrals. Would love to connect.'" },
    { type: 'callout', text: "The golden ratio: 80% genuine engagement, 20% business. If every interaction is a pitch, you'll get blocked. If every interaction is value, they'll seek YOU out.", icon: "💡" },
  ],

  // PHASE 3: Tool Mastery - LinkedIn
  "9-p3-tools": [
    { type: 'heading', text: "Tool Mastery: LinkedIn Personal Branding" },
    { type: 'paragraph', text: "Your LinkedIn profile is your 24/7 sales rep. It works while you sleep. When prospects Google you (and they will), your LinkedIn profile is the first thing they see." },
    { type: 'callout', text: "Check your Social Selling Index at linkedin.com/sales/ssi to see where you stand.", icon: "🔗" },
    { type: 'heading', text: "Training Resources" },
    { type: 'paragraph', text: "Watch the LinkedIn growth guide: 'How to grow your business on LinkedIn: A step by step guide' on YouTube (youtu.be/-1c6Jh54TLs)." },
    { type: 'heading', text: "Profile Optimization Checklist" },
    { type: 'bullets', items: [
      { bold: "Headline", text: "Not 'Account Executive at Referrizer.' Instead: 'I Help Local Businesses Get 50+ Five-Star Reviews and Double Their Referrals in 90 Days.'" },
      { bold: "Banner Image", text: "Custom banner with your value proposition. Not the default LinkedIn blue." },
      { bold: "About Section", text: "Tell a story. 'I watched my parents struggle to grow their small business. Now I help business owners like them automate their growth.' End with a CTA." },
      { bold: "Featured Section", text: "Pin your best Loom video, a case study, and a testimonial. Give visitors a reason to reach out." },
    ]},
    { type: 'heading', text: "Case Studies" },
    { type: 'steps', steps: [
      { step: "Salesloft", description: "Integrated social selling into daily rep workflows. Result: 2.5x more pipeline per rep." },
      { step: "A Leading Sales Tech Company", description: "Reps built 'Micro-Influencer' status by posting sales insights. Result: 40% of leads came from inbound profile views." },
      { step: "ZoomInfo", description: "Used LinkedIn to map decision-makers at target accounts. Result: 15% increase in C-Level meeting bookings." },
    ]},
  ],

  // PHASE 4: Persistence & Data Mastery
  "9-p4-read": [
    { type: 'heading', text: "Persistence & Data Mastery" },
    { type: 'quote', text: "The fortune is in the follow-up.", author: "Jim Rohn" },
    { type: 'paragraph', text: "High-ticket trade owners (HVAC, Plumbers, Roofers) are in the field. They don't check their generic 'info@' email. You need their direct mobile or personal email. When they say they're 'too busy,' your answer is: 'That's exactly why you need automation.'" },
    { type: 'heading', text: "The LAER Method" },
    { type: 'steps', steps: [
      { step: "Listen", description: "Hear them out completely. Don't interrupt. 'I'm on a job site, call me in 6 months' is not a rejection, it's information." },
      { step: "Acknowledge", description: "Validate their reality. 'I totally get it. You're in the field, you're busy, the last thing you need is another sales call.'" },
      { step: "Explore", description: "Ask one question about their current process. 'Quick question: when you finish a job, how are you currently asking for reviews? Or does it just not happen?'" },
      { step: "Respond", description: "Position automation as the solution to their busyness. 'What if your review requests went out automatically the moment you close a ticket in ServiceTitan? Zero effort from you. That's what I wanted to show you in literally 5 minutes.'" },
    ]},
    { type: 'heading', text: "The Persistence Data" },
    { type: 'paragraph', text: "80% of sales require 5+ touchpoints. But 44% of reps give up after just ONE follow-up. The gap between 'average' and 'elite' is not talent. It's persistence. Here's the math: if you make 5 touchpoints instead of 1, you're already in the top 10% of all salespeople." },
    { type: 'table', headers: ["Touchpoint", "Conversion Rate", "% of Reps Who Reach This"], rows: [
      ["1st contact", "2%", "100%"],
      ["2nd contact", "3%", "56%"],
      ["3rd contact", "5%", "37%"],
      ["4th contact", "10%", "20%"],
      ["5th+ contact", "80%", "8%"],
    ]},
    { type: 'callout', text: "The top 8% of reps close 80% of deals. The only difference? They follow up more than everyone else. Persistence is not annoying. It's professional.", icon: "📊" },
  ],

  // PHASE 4: Tool Mastery - Hunter.io
  "9-p4-tools": [
    { type: 'heading', text: "Tool Mastery: Hunter.io" },
    { type: 'paragraph', text: "Hunter.io finds and verifies professional email addresses. When the generic 'info@' bounces and the front desk won't patch you through, Hunter.io gets you the owner's direct email." },
    { type: 'callout', text: "Sign up for Hunter.io here: hunter.io/users/sign_up", icon: "🔗" },
    { type: 'heading', text: "Training Resources" },
    { type: 'paragraph', text: "Watch 'How to use Hunter.io' on YouTube (youtu.be/q7JRGFs8i44) for a complete walkthrough of domain search, email finder, and verification." },
    { type: 'heading', text: "Key Features for Referrizer AEs" },
    { type: 'bullets', items: [
      { bold: "Domain Search", text: "Enter any company's website domain. Hunter returns all known email addresses associated with that domain, with confidence scores." },
      { bold: "Email Finder", text: "Enter a name + company domain. Hunter finds their specific email address. Perfect for reaching the owner directly." },
      { bold: "Email Verifier", text: "Before you send, verify the email is valid. Reduces bounces, protects your sender reputation, and keeps your deliverability high." },
      { bold: "Bulk Operations", text: "Upload a CSV of company domains. Hunter returns verified emails for all of them. Scale your outreach without sacrificing quality." },
    ]},
    { type: 'heading', text: "Case Studies" },
    { type: 'steps', steps: [
      { step: "InVision", description: "Scaled designer outreach globally using Hunter's domain search. Result: 98% email deliverability." },
      { step: "Adobe", description: "Cleaned target lists for enterprise sales campaigns. Result: 30% reduction in email bounces." },
      { step: "Microsoft", description: "Targeted niche technology partners with verified contacts. Result: 25% increase in partner engagement rates." },
    ]},
    { type: 'callout', text: "Pro workflow: Apollo for finding the business, Hunter for verifying the owner's email, Loom for the personalized video, LinkedIn for the warm-up. Four tools, one unstoppable prospecting system.", icon: "🔗" },
  ],

  // DAY 9: Affiliate & Partnership Program (from Global SOP)
  "9-affiliate": [
    { type: 'heading', text: "Affiliate & Partnership Program" },
    { type: 'paragraph', text: "Beyond direct sales, Referrizer has a structured affiliate and partnership ecosystem that generates revenue through referral relationships. Understanding these programs helps you identify additional revenue streams and position Referrizer as a platform that rewards its community." },
    { type: 'heading', text: "Unified Bonus Matrix (Internal Referrals)" },
    { type: 'table', headers: ["Referral Type", "Reward", "Conditions"], rows: [
      ["Standard Referral", "$100 flat bonus", "Referred client signs up and pays for the first month"],
      ["High-Value Deal (>$2,000 MRR)", "10% of MRR for 12 months", "Must be a new logo, not an existing client expansion"],
      ["Corporate Residual Engine (3+ locations)", "10% of MRR for 12 months", "Enterprise deals with 3+ locations qualify for residual commissions"],
    ]},
    { type: 'heading', text: "Affiliate Partner Personas" },
    { type: 'bullets', items: [
      { bold: "Founding Partners", text: "Early adopters who helped shape the affiliate program. Higher commission rates (up to 15% of collected revenue) and priority support." },
      { bold: "Regular Partners", text: "Standard affiliates earning 5-10% of collected revenue from referred clients. 12-month attribution window." },
      { bold: "Sub-Affiliates", text: "Partners recruited by existing affiliates. The original affiliate earns an override on sub-affiliate revenue." },
      { bold: "Ambassador Clients", text: "Happy Referrizer clients who refer other businesses. Eligible for account credits or cash bonuses after 91+ days as a client." },
    ]},
    { type: 'heading', text: "Commission Rules" },
    { type: 'bullets', items: [
      { bold: "Revenue Share", text: "5-15% of collected (not invoiced) revenue. Commissions are paid only on revenue actually collected from the referred client." },
      { bold: "12-Month Attribution", text: "Affiliates earn commissions for 12 months from the client's first payment. After 12 months, the residual expires." },
      { bold: "60-Day Cookie", text: "If a prospect clicks an affiliate's link and signs up within 60 days, the affiliate gets credit regardless of other touchpoints." },
    ]},
    { type: 'heading', text: "The 60/90-Day Stability Clause (Clawback Rules)" },
    { type: 'callout', text: "If a referred client churns within 60 days of signing up, the affiliate bonus is clawed back in full. If they churn between 61-90 days, 50% is clawed back. After 90 days, the commission is fully vested. This protects against low-quality referrals.", icon: "⚠️" },
    { type: 'heading', text: "Cross-Departmental 90-Day Protection Window" },
    { type: 'bullets', items: [
      { bold: "Closer Ownership", text: "For 90 days after closing, all upsells on that account are credited to the original closer. This incentivizes proper onboarding." },
      { bold: "No Upselling During Onboarding", text: "Customer Success may not upsell during the onboarding period. Only the original closer may do so." },
      { bold: "Referral Bonus Eligibility", text: "Referral bonuses from a closed account are available only after 91+ days." },
    ]},
  ],

  // ===== DAY 10 =====
  "10-1": [
    { type: 'paragraph', text: "Over the last 10 days, you've built a complete sales arsenal. Here's everything you need to carry with you into every call, every demo, and every close." },
    { type: 'heading', text: "The Sales Process (Verbatim)" },
    { type: 'paragraph', text: "Establish rapport → Qualify (NIMTC) → Probe (open, closed, rephrase, directive) → Demo (Open, Body, Close) → Handle objections (6-step framework) → Close." },
    { type: 'heading', text: "The 5 Types of Objections" },
    { type: 'paragraph', text: "Smokescreens, Obstacles, Serious Concerns, Questions, Conditions. Treat all initial objections as smokescreens." },
    { type: 'heading', text: "The 6-Step Objection Framework" },
    { type: 'paragraph', text: "Hear out → Rephrase → Isolate → Handle → Confirm → Roll on." },
    { type: 'heading', text: "Your Closing Arsenal (12 Techniques)" },
    { type: 'bullets', items: [
      { bold: "Assumptive", text: "Act as if the sale is done." },
      { bold: "1-10", text: "Quantify readiness, surface the real objection." },
      { bold: "Feel-Felt-Found", text: "Empathy + proof + close." },
      { bold: "Summarize & Alternate Choice", text: "Recap value, offer two positive options." },
      { bold: "Imminent Doom", text: "Urgency through real deadlines." },
      { bold: "Sharp Angle", text: "Turn their request into your close." },
      { bold: "I'll Think It Over", text: "Peel back layers to the real concern." },
      { bold: "Create The Value", text: "Quality justifies premium pricing." },
      { bold: "Weigh The Facts", text: "Ben Franklin pros-and-cons close." },
      { bold: "Wish Ida", text: "Regret aversion." },
      
      { bold: "The Breakup", text: "Loss aversion follow-up that gets replies." },
    ]},
    { type: 'heading', text: "The Mindset" },
    { type: 'paragraph', text: "80% Psychology, 20% Skill. PAIN = PROFIT. The 4 Stages of Competence. Written goals. The Elite Performer's 3 T's: Time, Talent, Tenacity." },
    { type: 'callout', text: "You've earned this. Now go prove it on the Graduation Exam and the AI CEO Interview. You are ready.", icon: "🏆" },
  ],

  "10-2": [
    { type: 'heading', text: "Sales Process Verbatim Drill" },
    { type: 'callout', text: "Read each section aloud. Then cover it and recite from memory. Repeat until perfect.", icon: "🧠" },
    { type: 'heading', text: "The 7 Steps" },
    { type: 'paragraph', text: "1. Establish Rapport — 2. Qualify (NIMTC) — 3. Probe — 4. Demo (Open, Body, Close) — 5. Establish Decision Maker — 6. Handle Objections — 7. Close." },
    { type: 'heading', text: "The 6-Step Objection Framework" },
    { type: 'paragraph', text: "1. Hear them out — 2. Rephrase it — 3. Isolate it — 4. Handle it — 5. Confirm you handled it — 6. Roll on and close." },
    { type: 'heading', text: "NIMTC" },
    { type: 'paragraph', text: "Needs — Interest — Money — Time — Commitment." },
    { type: 'heading', text: "The Pre-Commitment" },
    { type: 'paragraph', text: "'When I'm able to prove excellent ROI with an all-in-one automation solution satisfying all of the described marketing needs, and of course keep it affordable, will we be in the position to earn your business today?'" },
    { type: 'heading', text: "The Obligation Statement" },
    { type: 'paragraph', text: "'My obligation is not to waste your time today so we can see if there is a mutual fit.'" },
    { type: 'heading', text: "The Universal Rebuttal" },
    { type: 'paragraph', text: "'The purpose of my call is not to sell you anything, but to gain your professional opinion on our marketing solutions, so that when you ARE [interested/in the market/in a position], you will know what is available.'" },
  ],

  "10-3": [
    { type: 'heading', text: "Quick-Reference: All 19 Closing Techniques" },
    { type: 'table', headers: ["Close", "When to Use", "Key Line"], rows: [
      ["Assumptive", "Strong buying signals", "'I have everything ready to sign you up so we can get your campaigns live!'"],
      ["Next Steps", "Flawless demo", "'The next step is to choose your plan and get onboarding scheduled.'"],
      ["If-Then", "Start of demo", "'If I show you ROI in 90 days, will you move forward today?'"],
      ["Question Close", "Soft, low-pressure", "'Does it make sense to get started today?'"],
      ["1-10", "Uncertain prospect", "'On a scale of 1-10, where are we?' Then: 'What makes it a 10?'"],
      ["Ben Franklin", "Analytical buyer", "'Let's list the pros and cons and let the facts decide.'"],
      ["Alternate Choice", "End of demo", "'Do you want to start with or without the Platinum Plan?'"],
      ["Basic Written", "Defensive prospect", "'Let me write down notes so I don't forget your specific needs.'"],
      ["Create The Value", "Price concern", "'We invested in quality and only explain the price once.'"],
      ["Reduce to Ridiculous", "Monthly price objection", "'$150/month ÷ 30 = $5/day. Less than a coffee.'"],
      ["Cost Too Much", "Value objection", "'The platform will produce revenue that more than justifies its investment.'"],
      ["Not in Budget", "Budget smokescreen", "'You retain the right to flex that budget for your company's future.'"],
      ["Feel-Felt-Found", "Skepticism", "'I appreciate how you feel. [Name] felt the same. What they found was...'"],
      ["Wish Ida", "Hesitant buyer", "'Get rid of one potential Wish Ida by saying yes today.'"],
      ["Cost of Inaction", "Procrastinator", "'What will it cost you in lost revenue over the next 6 months?'"],
      ["Imminent Doom", "Real deadline", "'To guarantee these incentives, we need to get you signed up today.'"],
      ["Think It Over", "They stall", "'What specifically do you want to think over? The company? The investment?'"],
      ["Sharp Angle", "They ask for something", "'If I can do that, will we go forward today?'"],
      ["Takeaway", "Arrogant/stalling", "'Referrizer might not be the right fit for you right now.'"],
    ]},
  ],

  // ===== DAY 10: COMPREHENSIVE REVIEW =====
  "10-p1-read": [
    { type: 'heading', text: "Days 1-3: Foundation, Product & CRM Mastery" },
    { type: 'paragraph', text: "Day 1 introduced the Triad: Referrizer (retention and referrals), We Rank Higher (SEO and web), and True Conversions (ads and funnels). Together they form the Ultimate Marketing Loop: Attract, Rank, Retain, Refer, Repeat. Every marketing dollar compounds instead of evaporating." },
    { type: 'bullets', items: [
      { bold: "Core Values", text: "Speed to Value, Customer Obsession, Radical Transparency, and the Referrizer way." },
      { bold: "Check-in Trigger", text: "The core engine. A real-world event (customer visit) triggers automated review requests, loyalty points, referral prompts, and campaigns." },
      { bold: "TAM", text: "$2.9T+ across fitness, home services, pet care, auto repair, insurance." },
      { bold: "Home Services", text: "Highest Revenue per Lead vertical. $2,500-$15,000+ per job. ServiceTitan, Jobber, Housecall Pro integrations." },
    ]},
    { type: 'heading', text: "Close CRM & Lead Management" },
    { type: 'bullets', items: [
      { bold: "NIMTC", text: "Needs, Interest, Money, Time, Commitment. The five pillars of qualification." },
      { bold: "Smart Views", text: "Dynamic lead lists. Start every morning with Today's Follow-Ups." },
      { bold: "Pipeline Coverage", text: "3x-4x your MRR target. $4K target = $12K-$16K in pipeline." },
      { bold: "Speed to Lead", text: "First Workflow step fires within 5 minutes. Response rates drop 80% after the first hour." },
    ]},
  ],
  "10-p2-read": [
    { type: 'heading', text: "Days 4-5: The Sales Process & Objection Arsenal" },
    { type: 'paragraph', text: "Day 4 built the complete sales process: Mindset (80% psychology), Opening (Obligation Statement, Golden Question, NIMTC), Discovery (PAIN = PROFIT, Challenger: Teach/Tailor/Take Control), Body (Inverted Pyramid demos, FABs, Trial Closes), Objections (6-Step Framework), and Close (12+ techniques)." },
    { type: 'bullets', items: [
      { bold: "6-Step Objection Framework", text: "Hear, Rephrase, Isolate, Handle, Confirm, Roll. The single most important skill." },
      { bold: "Smokescreens vs Conditions", text: "Smokescreens are reflexive defenses you CAN overcome. Conditions (bankruptcy) are hard stops." },
      { bold: "Price Objections", text: "Usually discovery failures. Use Sandler Bracketing and ROI reframing." },
      { bold: "Team Selling", text: "Multiple seller participants increase close rates by up to 258%." },
    ]},
    { type: 'quote', text: "Sales is the art of asking questions. The better your questions, the more pain you uncover, and the easier the close.", author: "Sales Maxim" },
  ],
  "10-p3-read": [
    { type: 'heading', text: "Days 6-8: Closing, Signals & Sales Psychology" },
    { type: 'paragraph', text: "Day 6 taught buying signals: Verbal (Possessive Shift, Future Pacing), Behavioral (Lean-In, Unmute, Feature Deep-Dives), and Digital (Proposal Velocity). Day 7 armed you with 12+ closing techniques. Day 8 gave you the psychology of influence." },
    { type: 'bullets', items: [
      { bold: "The Shift in Ownership", text: "When prospects move from IF questions to HOW questions, stop selling and start guiding." },
      { bold: "Social Proof", text: "95% of people are imitators. Use case studies in every objection response." },
      { bold: "Loss Aversion", text: "Losing is 2x more powerful than gaining. Lead with what they are LOSING." },
      { bold: "Anchoring", text: "Mention $3,000/month agency first. Referrizer at $200-$500 feels like a bargain." },
      { bold: "Yes-Ladder", text: "3-5 small agreements build cognitive consistency for the final close." },
    ]},
    { type: 'quote', text: "If you believe more than they doubt, you close.", author: "The Conviction Principle" },
  ],
  "10-p4-read": [
    { type: 'heading', text: "Day 9: Business Development Tools & Persistence" },
    { type: 'bullets', items: [
      { bold: "Apollo.io", text: "Hyper-specific filters by industry, ZIP code, revenue. Build 200+ qualified prospect lists in minutes." },
      { bold: "Loom", text: "Hook-Gap-CTA framework. Under 90 seconds. Show them their Review Gap visually." },
      { bold: "LinkedIn", text: "Social Wrap-Around: Connect, engage, add value, THEN pitch. 80% genuine, 20% business." },
      { bold: "Hunter.io", text: "Verify emails before sending. Bounced emails damage sender reputation." },
      { bold: "LAER Method", text: "Listen, Acknowledge, Explore, Respond. Turns 'I'm too busy' into 'show me in 5 minutes.'" },
    ]},
    { type: 'callout', text: "80% of sales happen after the 5th touchpoint. Only 8% of reps get there. Persistence is discipline, not talent.", icon: "💪" },
    { type: 'quote', text: "You will get all you want in life, if you help enough other people get what they want.", author: "Zig Ziglar" },
  ],
};
