import type { ContentBlock } from './readingContent';

export const READING_CONTENT_WEEK1: Record<string, ContentBlock[]> = {
  // ===== DAY 1 =====
  "1-2": [
    { type: 'paragraph', text: "Referrizer isn't one company — it's three companies that work as one. Together, they create what we call the Ultimate Marketing Loop: a system where every dollar a local business spends on marketing compounds instead of evaporating." },
    { type: 'heading', text: "The Three Companies" },
    { type: 'bullets', items: [
      { bold: "Referrizer", text: "The retention and referral engine. Loyalty programs, automated SMS/email campaigns, reputation management, and referral programs that turn one customer into many." },
      { bold: "We Rank Higher", text: "The organic visibility arm. SEO, website development, and ongoing site health monitoring so businesses get found on Google without paying for every click." },
      { bold: "True Conversions", text: "The paid acquisition engine. Google and social media ads combined with landing pages and automated follow-up sequences that turn strangers into leads." },
    ]},
    { type: 'heading', text: "The Loop in Action" },
    { type: 'paragraph', text: "Here's how they connect: True Conversions runs an ad campaign that drives new leads to a gym. We Rank Higher ensures that gym shows up at the top of Google when those leads search for 'gym near me.' Referrizer captures those leads, turns them into loyal members with a rewards program, then asks them to refer their friends — creating new leads that start the loop again." },
    { type: 'callout', text: "The result: each company's output feeds the next company's input. Attract → Rank → Retain → Refer → Repeat.", icon: "🔄" },
    { type: 'heading', text: "Why This Matters to You" },
    { type: 'paragraph', text: "As a member of this team, you represent all three. When you speak to a business owner, you're not selling one tool — you're offering a complete growth ecosystem. No competitor offers this. That's your edge." },
  ],

  "1-6": [
    { type: 'heading', text: "The Ultimate Marketing Loop — Case Studies" },
    { type: 'paragraph', text: "Let's look at how the three companies actually work together in the real world. These aren't hypothetical — these are the exact patterns that generate compounding revenue for our clients." },
    { type: 'heading', text: "Case Study: FitZone Gym (Multi-Location Fitness)" },
    { type: 'steps', steps: [
      { step: "True Conversions: Acquisition", description: "Runs 'Free Trial Week' ads on Google targeting 'gym near me' + 3-mile radius. Landing page with social proof captures leads." },
      { step: "We Rank Higher: Visibility", description: "Optimizes Google Business Profile for all 5 locations. Creates monthly blog content targeting 'best gym in [city]' keywords." },
      { step: "Referrizer: Retention", description: "Check-in triggers automate review requests after every visit. Loyalty program: 1 point per visit, 10 points = free smoothie. Referral campaign: 'Refer a friend, both get 20% off next month.'" },
      { step: "The Loop Completes", description: "New members from referrals check in → trigger more reviews → rank higher on Google → attract organic leads → retention programs keep them → they refer friends → the loop continues." },
    ]},
    { type: 'heading', text: "Case Study: Bright Smiles Dental" },
    { type: 'paragraph', text: "A dental practice with 2 locations struggling with a 2.8-star Google rating and declining new patient inquiries." },
    { type: 'bullets', items: [
      { bold: "Before Referrizer", text: "2.8 stars on Google, 3 new patient inquiries/week, no loyalty program, manual appointment reminders." },
      { bold: "After 90 Days", text: "4.7 stars (132 new Google reviews), 14 new patient inquiries/week, 34% of patients enrolled in loyalty, automated recall program recovered 67 lapsed patients." },
    ]},
    { type: 'callout', text: "ROI: $4,200/month investment → $38,000/month in attributed new patient revenue. That's a 9x return.", icon: "💰" },
    { type: 'heading', text: "The Revenue Math" },
    { type: 'paragraph', text: "Every touchpoint in the loop generates measurable revenue. A check-in at a gym is worth $5 in lifetime value. At a dental practice, it's $800+. At a home services company, it's $2,500-$15,000+ per job. The loop's value scales with the client's average customer lifetime value." },
  ],

  "1-7": [
    { type: 'heading', text: "Our Mission" },
    { type: 'paragraph', text: "Referrizer exists to empower local businesses with enterprise-grade marketing tools at accessible prices. We believe that every local business — from a single-location gym to a 50-location franchise — deserves the same marketing firepower as a Fortune 500 company." },
    { type: 'heading', text: "Core Values" },
    { type: 'bullets', items: [
      { bold: "Speed to Value", text: "If it takes a month to see results, it's too slow. Clients must see measurable impact in the first week. This applies to sales too — every prospect should walk away from a demo thinking 'I need this NOW.'" },
      { bold: "Customer Obsession", text: "We don't build features — we solve real pains for real local business owners who wear many hats. Every feature, every campaign, every interaction starts with: 'What pain does this solve?'" },
      { bold: "Radical Transparency", text: "We share the good, the bad, and the ugly with our team and our clients. Trust is earned through honesty. This extends to pricing — always communicate complete costs including overages." },
      { bold: "Relentless Improvement", text: "We are never done. The product evolves, the sales process evolves, and YOU evolve. Complacency is the enemy of excellence." },
      { bold: "Team Over Individual", text: "Your success is the team's success. Share your wins, share your scripts, share your techniques. The rising tide lifts all boats." },
    ]},
    { type: 'heading', text: "The Culture" },
    { type: 'paragraph', text: "Referrizer is a high-performance culture. We celebrate wins loudly. We address failures quickly and without blame. We move fast, we ship fast, and we learn fast. If you're waiting for permission to improve something, you're already behind." },
    { type: 'quote', text: "The most convicted person in the room WINS. You choose to INFLUENCE your prospect with YES instead of INFECT with NO.", author: "Referrizer Sales Training" },
  ],

  "1-9": [
    { type: 'heading', text: "The Sales Organization" },
    { type: 'paragraph', text: "Understanding where you fit in the machine is critical. The sales team operates as a coordinated unit with clear roles, handoffs, and accountability." },
    { type: 'bullets', items: [
      { bold: "VP of Sales (Daniel Lindros)", text: "Sets strategy, quota targets, and compensation structures. Your direct escalation path for complex deals." },
      { bold: "Account Executives (You)", text: "Own the full cycle: prospect, qualify, demo, close. You're measured on demos completed, close rate, and revenue." },
      { bold: "Client Executives", text: "A hybrid role of account management and business development aimed at retaining a targeted customer assignment. Cross-sell, upsell, and work leads from other sales channels." },
      { bold: "Call Center Agents", text: "Focused on scheduling qualified meetings to complete group and 1-on-1 product demonstrations." },
      { bold: "Customer Success", text: "Takes over after the close. Owns onboarding and training. A clean handoff here prevents churn." },
    ]},
    { type: 'heading', text: "Team Rituals" },
    { type: 'bullets', items: [
      { bold: "Weekly Pipeline Review (Monday)", text: "Full pipeline review with manager. Every deal must be current, qualified, and moving." },
      { bold: "Win/Loss Debrief (Friday)", text: "Team shares biggest wins and losses of the week. What worked? What didn't? What do we steal?" },
      { bold: "Monthly Leaderboard", text: "Top performers recognized. Bonuses, prizes, and bragging rights." },
    ]},
  ],

  "1-10": [
    { type: 'heading', text: "Your Technology Stack" },
    { type: 'paragraph', text: "You'll use a specific set of tools every day. Mastering these tools is as important as mastering the sales process — they're what allow you to operate at scale." },
    { type: 'heading', text: "Close.com (CRM)" },
    { type: 'paragraph', text: "Close.com is your command center. Everything lives here: leads, calls, emails, tasks, pipeline, and reporting." },
    { type: 'steps', steps: [
      { step: "Accept Your Invite", description: "Check your email for the Close.com invitation. Click the link and create your account with your @referrizer.com email." },
      { step: "Configure Smart Views", description: "Smart Views are saved filters that show you exactly the leads you need. Set up: 'Hot Leads (Last 7 Days)', 'Follow-Up Today', 'Stale Pipeline (14+ Days)'" },
      { step: "Set Up Notifications", description: "Enable real-time notifications for new lead assignments, email opens, and task reminders." },
      { step: "Learn Basic Functions", description: "Make a test call, send a test email, create a test task, and move a lead through pipeline stages." },
      { step: "Import Your First Leads", description: "Your manager will assign your initial lead list. Import via CSV or receive them through automated routing." },
    ]},
    { type: 'heading', text: "Communication Tools" },
    { type: 'bullets', items: [
      { bold: "Slack", text: "#sales-team for team communication, #wins for celebrating closes, #product-updates for feature releases." },
      { bold: "Zoom/Google Meet", text: "For demos. Always have your camera on. Always share your screen. Always record (with permission)." },
      { bold: "Calendar Management", text: "Use Synapsa and Calendly linked to your Close.com. Block focus time for outbound prospecting." },
    ]},
  ],

  "1-12": [
    { type: 'heading', text: "Professional Communication Standards" },
    { type: 'paragraph', text: "Every email, call, and message you send represents the Referrizer brand. First impressions are permanent, and in sales, professionalism is table stakes." },
    { type: 'heading', text: "Email Guidelines" },
    { type: 'bullets', items: [
      { bold: "Subject Lines", text: "Clear, specific, and benefit-oriented. Bad: 'Following up.' Good: 'The review strategy we discussed — next steps for [Business Name].'" },
      { bold: "Response Time", text: "Inbound leads: respond within 5 minutes during business hours. Follow-ups: same business day." },
      { bold: "Signature", text: "Full name, title, phone number, Calendly link. No inspirational quotes." },
      { bold: "Tone", text: "Professional but conversational. You're a trusted advisor, not a corporate robot." },
    ]},
    { type: 'heading', text: "Call Etiquette" },
    { type: 'bullets', items: [
      { bold: "Environment", text: "Quiet background, good microphone, no distractions." },
      { bold: "Energy", text: "Smile when you dial. Your tone communicates more than your words." },
      { bold: "Notes", text: "Take notes in Close.com during or immediately after every call. Memory is unreliable." },
      { bold: "Recording", text: "Always ask permission: 'Do you mind if I record this for my notes?' Most say yes." },
    ]},
  ],

  "1-13": [
    { type: 'heading', text: "Your First 30 Days: The Roadmap" },
    { type: 'paragraph', text: "Success in sales is built one day at a time. Here's exactly what you need to accomplish in your first month." },
    { type: 'heading', text: "Week 1: Learn (Days 1-5)" },
    { type: 'bullets', items: [
      { bold: "Complete Days 1-5 of Academy", text: "Orientation, Product Knowledge, CRM, Sales Process, Objection Handling." },
      { bold: "Shadow 3 live demos", text: "Observe top performers. Take notes on their rapport, probing, and closing techniques." },
      { bold: "Deliver 1 practice demo", text: "To your manager. Get feedback. Don't worry about perfection." },
    ]},
    { type: 'heading', text: "Week 2: Practice (Days 6-10)" },
    { type: 'bullets', items: [
      { bold: "Complete Days 6-10 of Academy", text: "Closing Mastery, Psychology, Advanced Strategy, Graduation." },
      { bold: "Deliver 3 practice demos", text: "To peers and managers. Incorporate feedback from each one." },
      
    ]},
    { type: 'heading', text: "Week 3: Perform" },
    { type: 'bullets', items: [
      { bold: "Target: 4 live demos", text: "Real prospects, real conversations. Manager may observe." },
      
      { bold: "First close attempt", text: "Don't worry if you don't close. The experience is the goal." },
    ]},
    { type: 'heading', text: "Week 4: Ramp" },
    { type: 'bullets', items: [
      { bold: "Target: 6 live demos", text: "Refine your process based on week 3 feedback." },
      { bold: "Target: First closed deal", text: "This is the milestone. When it happens, ring the bell." },
      { bold: "Pipeline review with manager", text: "Full audit of every deal. Clean, qualify, and prioritize." },
    ]},
    { type: 'callout', text: "By Day 30, you should have: completed all 10 Academy days, shadowed 3+ demos, delivered 7+ practice demos, and ideally closed your first deal.", icon: "🎯" },
  ],

  // ===== DAY 2 =====
  "2-2": [
    { type: 'paragraph', text: "Referrizer is an all-in-one marketing automation platform built specifically for local businesses. When a client buys Referrizer, they're not buying a 'text messaging tool.' They're buying abandoned cart recovery, intelligent drip sequences, smart CRM routing, and automated ROI. This module covers every feature in depth." },
    { type: 'heading', text: "Core Platform Features" },
    { type: 'bullets', items: [
      { bold: "Reputation Management", text: "Automated review requests sent after every customer visit via SMS. Monitoring exclusively on Google. AI-powered response suggestions that maintain brand voice. This is the #1 feature that sells — every business owner cares about their Google rating." },
      { bold: "Loyalty Programs", text: "Digital punch cards, point systems, and VIP tiers that keep customers coming back. No proprietary hardware required — unlike competitors like Fivestars who force hardware rentals." },
      { bold: "SMS & Email Marketing", text: "Automated campaigns triggered by customer behavior. Win-back campaigns for lapsed customers, promotional offers, drip sequences, and smart scheduling. Our internal SMS cost is $0.01–$0.05 and email is $0.0015–$0.005." },
      { bold: "Referral Programs", text: "Automated 'refer a friend' campaigns with tracking and two-sided rewards. One happy customer can generate 3-5 new leads. The referral loop is what compounds growth over time." },
      { bold: "Pipeline & CRM", text: "Contact management with smart segmentation, lead scoring, automated follow-up sequences, and lifecycle tracking from prospect to loyal advocate." },
      { bold: "AI Assist", text: "AI-powered review responses, campaign suggestions, content generation, and intelligent routing. Automates the work that business owners don't have time for." },
      { bold: "SmartLine & Quick Connect", text: "Dedicated business phone number with call tracking, automated lead capture widgets, and instant SMS follow-up for missed calls." },
      
    ]},
    { type: 'heading', text: "The Revenue Engine" },
    { type: 'paragraph', text: "Each feature isn't standalone — they work together as a compounding system. Reputation drives new customers in the door. Loyalty keeps them coming back. SMS/Email re-engages lapsed customers. Referrals turn one customer into many. Pipeline tracks it all. AI makes it effortless. The whole is exponentially greater than the sum of its parts." },
    { type: 'callout', text: "When you demo Referrizer, you're not selling software — you're selling automated revenue. Every feature connects to a dollar amount the business owner can understand.", icon: "💰" },
  ],

  "2-3": [
    { type: 'heading', text: "The Check-in Trigger: The Core of Referrizer's Value" },
    { type: 'paragraph', text: "The Check-in Trigger is the single most important concept in the entire Referrizer ecosystem. Every time a customer checks in, it triggers a cascade of automated marketing actions. This is what makes Referrizer fundamentally different from every competitor in the market." },
    { type: 'heading', text: "How It Works" },
    { type: 'steps', steps: [
      { step: "Customer Checks In", description: "QR scan, staff tap, digital sign-in, POS integration, or third-party software trigger." },
      { step: "Automated Review Request", description: "30 minutes after visit, customer receives an SMS: 'Thanks for visiting! Mind leaving a quick Google review?' Drives the 10x Review Guarantee." },
      { step: "Loyalty Points Awarded", description: "Customer earns points automatically. No punch cards. No forgotten wallets. Digital, seamless, instant." },
      { step: "Referral Prompt Triggered", description: "After 3rd visit, customer gets: 'Love [Business]? Refer a friend and both get 20% off!' Turns happy customers into brand ambassadors." },
      { step: "Win-Back for Lapsed Customers", description: "If a regular customer hasn't visited in 30 days, automatic 'We miss you!' campaign fires with a personalized offer." },
    ]},
    { type: 'heading', text: "The Economics of a Check-in by Industry" },
    { type: 'paragraph', text: "In the gym world, a check-in is worth $5. But in our expansion verticals, a check-in represents a transaction or relationship worth $500 to $15,000. This is the core insight driving our ICP expansion." },
    { type: 'table', headers: ["Industry", "Check-in Trigger", "Value per Check-in", "Frequency"], rows: [
      ["Fitness/Gym", "Member scan at entrance", "$5–$15 LTV", "3–5x/week"],
      ["Dental/Medical", "Patient arrival", "$200–$800 per visit", "2–4x/year"],
      ["Home Services", "Technician marks job 'Arrived' or 'Completed'", "$2,500–$15K+ per job", "Variable"],
      ["Auto Repair", "Repair order opened or LPR scan", "$800+ per ticket", "2–3x/year"],
      ["Pet Care/Grooming", "Pet check-in at boarding/grooming facility", "$50–$150/visit", "3–5x/week"],
      ["Insurance", "Policy bound or renewed", "$1,500+ per policy", "1–2x/year"],
    ]},
    { type: 'callout', text: "When you demo Referrizer, ALWAYS start with the Check-in Trigger. It's the moment business owners go from 'interesting' to 'I need this.' The check-in is not a feature — it's the engine that powers every other feature.", icon: "💡" },
    { type: 'heading', text: "The Marketing Loop in Action" },
    { type: 'paragraph', text: "Check-in → Review Request → More Google Reviews → Higher Google Ranking → More New Customers → More Check-ins → More Loyalty Points → More Referrals → Even More New Customers. This is the virtuous cycle that no competitor can replicate because they don't have the full stack." },
  ],

  "2-5a": [
    { type: 'heading', text: "Primary ICP: SMB Fitness, Wellness & Personal Services" },
    { type: 'paragraph', text: "Referrizer was born in the fitness vertical and this remains our strongest market. Gyms, yoga studios, martial arts schools, spas, salons, and personal trainers — these businesses share critical characteristics that make them ideal Referrizer clients." },
    { type: 'heading', text: "Why Fitness & Wellness Is Our Foundation" },
    { type: 'bullets', items: [
      { bold: "High Check-in Frequency", text: "Members visit 3–5 times per week, creating dozens of automated touchpoints per month per customer. More check-ins = more reviews, more loyalty engagement, more referral prompts." },
      { bold: "Recurring Revenue Model", text: "Monthly memberships mean predictable revenue for the business — and predictable value from Referrizer. Churn reduction through loyalty programs has direct, measurable impact." },
      { bold: "Review-Dependent", text: "When someone searches 'gym near me,' the Google star rating is the #1 factor in their decision. Reputation management is not optional — it's survival." },
      { bold: "Multi-Location Potential", text: "Franchises and chains with 5–50+ locations need centralized marketing with local execution. These are our highest-value deals." },
      { bold: "Low Technical Barrier", text: "Gym owners are operators, not technologists. They need plug-and-play solutions. Referrizer's out-of-the-box setup is a perfect match." },
    ]},
    { type: 'heading', text: "The Fitness Vertical by the Numbers" },
    { type: 'table', headers: ["Metric", "Value"], rows: [
      ["US Gym & Fitness Market (2026)", "$38.6B"],
      ["Number of Gyms in US", "41,000+"],
      ["Average Monthly Membership", "$50–$80"],
      ["Average Member Lifetime", "4.7 months"],
      ["Value of One Check-in", "$5–$15 LTV"],
      ["Revenue per Location (Referrizer)", "$299–$599/mo"],
    ]},
    { type: 'heading', text: "Expanding Within the Vertical" },
    { type: 'paragraph', text: "Beyond traditional gyms, the fitness/wellness vertical includes yoga studios, Pilates, CrossFit boxes, martial arts dojos, boxing clubs, personal training studios, massage therapy, chiropractic offices, med-spas, and beauty salons. Each sub-vertical has slightly different needs but the same core pain: they need more customers, more reviews, and more retention." },
    { type: 'heading', text: "The Mid-Market Opportunity" },
    { type: 'paragraph', text: "Our sweet spot is expanding from SMB (1–5 locations) into the mid-market (5–50 locations). Multi-location deals represent 3–10x the MRR of single-location deals, with lower per-location acquisition costs. These clients also have dedicated marketing staff who appreciate Referrizer's automation capabilities." },
    { type: 'callout', text: "When selling to fitness/wellness, always lead with: reputation management, the check-in trigger, and the win-back campaign. These three features alone justify the entire investment.", icon: "🏋️" },
  ],

  "2-5b": [
    { type: 'heading', text: "ICP Expansion: Home Services & Skilled Trades" },
    { type: 'callout', text: "Market Opportunity (2026): $463 Billion (US) / ~$40 Billion (Canada). Referrizer Fit Score: 9/10", icon: "🏠" },
    { type: 'paragraph', text: "Homeowners are 4x more likely to hire a contractor based on a neighbor's referral. Referrizer automates the 'Post-Job Review' and 'Refer-a-Neighbor' loop that skilled trades businesses desperately need but have zero time to manage manually." },
    { type: 'heading', text: "Why Referrizer Fits" },
    { type: 'bullets', items: [
      { bold: "The Check-in Trigger", text: "Triggered when a technician marks a job as 'Arrived' or 'Completed' in their CRM. This replaces the gym check-in and works identically in our automation engine." },
      { bold: "Revenue Potential", text: "These businesses have massive marketing budgets and low patience for manual follow-up. Average job ticket: $2,500–$15,000+. A single new customer acquired through a referral or review is worth more than an entire year of Referrizer subscription." },
      { bold: "Review Economics", text: "When your A/C breaks in August, you're Googling 'HVAC repair near me' and choosing the company with the most 5-star reviews. Reputation management is life or death for these businesses." },
    ]},
    { type: 'heading', text: "Target CRM Integrations" },
    { type: 'bullets', items: [
      { bold: "Jobber", text: "Our primary target CRM. The leading platform for mid-sized residential services with massive adoption among 2–10 person companies. Zapier trigger integration enables rapid deployment — approximately one hour per installation and onboarding instance." },
      { bold: "ServiceTitan", text: "The 'Enterprise' standard for HVAC, plumbing, and electrical. Over 10,000 contractors on the platform." },
      { bold: "Housecall Pro", text: "Massive adoption among owner-operators. Strong Zapier integration for streamlined setup while native integration is developed." },
    ]},
    { type: 'heading', text: "The Sales Pitch for Home Services" },
    { type: 'script', label: "Example Pitch", lines: [
      { speaker: "You", text: "Right now, when your technician finishes a $3,000 A/C install, what happens?" },
      { speaker: "Them", text: "They move on to the next job." },
      { speaker: "You", text: "Exactly. So that homeowner who just spent $3,000 and is thrilled with the service — they never get asked for a review, never get a referral prompt, never get enrolled in a loyalty program. That's $15,000+ in lost lifetime value per job. With Referrizer, the second your tech marks that job complete in ServiceTitan, the homeowner automatically gets a review request, a referral offer, and they're enrolled in your rewards program. Zero manual work. Zero dropped balls." },
    ]},
    { type: 'callout', text: "Home Services is the highest 'Revenue per Lead' expansion vertical. Integration priorities focus on Jobber, ServiceTitan, and Housecall Pro.", icon: "🎯" },
  ],

  "2-5c": [
    { type: 'heading', text: "ICP Expansion: Pet Care (Boarding, Grooming & Training)" },
    { type: 'callout', text: "Market Opportunity: $5.37 Billion (Boarding/Grooming specific) in North America. Referrizer Fit Score: 9.5/10", icon: "🐾" },
    { type: 'paragraph', text: "Pet Care is a primary expansion industry for Referrizer. The business logic perfectly mirrors our existing gym workflows, but with 3x higher ticket prices. Pet owners check in multiple times per week for boarding and grooming, creating the same high-frequency touchpoint pattern that drives our gym success." },
    { type: 'heading', text: "Why 9.5/10 Fit Score" },
    { type: 'bullets', items: [
      { bold: "High Check-in Frequency", text: "Pet owners check in 3-5x per week for boarding and grooming. That's 12-20+ touchpoints per month per client. For a facility with 200 active pets, that's thousands of automated marketing actions per month." },
      { bold: "Reviews Drive Discovery", text: "When pet owners search for boarding or grooming, Google reviews are the first thing they check. A 4.8-star rating vs. a 3.5-star rating can mean the difference between a waitlist and empty kennels." },
      { bold: "Strong Lifetime Value", text: "A regular boarding client spends $3,000-$8,000+ per year on boarding, grooming, and training. One new loyal client acquired through referrals pays for the platform many times over." },
      { bold: "Referral-Driven Industry", text: "Pet owners talk to other pet owners constantly. Dog parks, vet offices, and neighborhood groups are referral goldmines. Automating the referral prompt after every positive check-in capitalizes on this natural behavior." },
    ]},
    { type: 'heading', text: "Target CRM Integrations" },
    { type: 'bullets', items: [
      { bold: "Gingr", text: "The dominant pet care management platform. Our Phase 2 integration priority for Q3 2026. Business logic mirrors gym integrations perfectly." },
      { bold: "PetExec", text: "Popular with multi-location pet care facilities. Strong API for seamless integration." },
      { bold: "Kennel Connection", text: "Widely used by independent boarding and kennel facilities across North America." },
    ]},
    { type: 'heading', text: "The Math That Wins the Deal" },
    { type: 'paragraph', text: "A pet boarding facility with 200 active clients averaging $300/month generates $60,000/month in revenue. If Referrizer's automated review and referral system helps them acquire just 3 new regular clients per month, that's $10,800/year in new revenue from a $299/month investment. That's a 3x return, and it compounds every month." },
    { type: 'callout', text: "When pitching pet care facilities, lead with the review math. Show them: 'Three new regular clients from better Google reviews pays for the entire year of Referrizer in the first month.' The ROI is undeniable.", icon: "💡" },
  ],

  "2-5d": [
    { type: 'heading', text: "ICP Expansion: Auto Repair & Insurance" },
    { type: 'paragraph', text: "Beyond our top-priority verticals (Home Services and Pet Care), two additional markets present enormous opportunities with slightly different dynamics." },

    { type: 'heading', text: "1. Specialized Automotive (Repair & Detailing)" },
    { type: 'callout', text: "Market Opportunity: $1.13 Trillion (Global) / ~$380B (North America). Fit Score: 8/10", icon: "🔧" },
    { type: 'paragraph', text: "People are terrified of 'bad mechanics.' A referral from a friend or a 5-star Google rating is the only way these shops win new business. Average repair tickets are rising due to vehicle complexity ($800+)." },
    { type: 'bullets', items: [
      { bold: "Check-in Trigger", text: "Triggered when a Repair Order (RO) is opened or a car is scanned via License Plate Recognition (LPR)." },
      { bold: "Target Integrations", text: "Shopmonkey (the 'Shopify of Auto Repair'), Tekmetric (high-performance shop management), Washify/Rinsed (high-volume car wash memberships)." },
      { bold: "Sales Angle", text: "Fear-based buying. 'Your customer just spent $1,200 on brake work. If you don't ask them for a review in the next hour, your competitor will get that customer next time.'" },
    ]},

    { type: 'heading', text: "2. Pet Care (Boarding, Grooming & Training)" },
    { type: 'callout', text: "Market Opportunity: $5.37 Billion (Boarding/Grooming specific) in North America. Fit Score: 9.5/10", icon: "🐾" },
    { type: 'paragraph', text: "Identical workflow to gyms but with 3x higher ticket prices. Pet owners check in multiple times per week for boarding and grooming, creating the same high-frequency touchpoint pattern that drives our gym success." },
    { type: 'bullets', items: [
      { bold: "Check-in Trigger", text: "Triggered by the pet's 'Check-in' status in the facility software." },
      { bold: "Target Integrations", text: "Gingr (the dominant pet care management platform — our Phase 2 integration target for Q3 2026 as the 'low-hanging fruit' since business logic mirrors gym integrations)." },
      { bold: "Revenue Potential", text: "Highly fragmented market with thousands of independent owners. Medium-high individual deal size, massive volume opportunity." },
    ]},

    { type: 'heading', text: "3. Independent Insurance Agencies (P&C)" },
    { type: 'callout', text: "Market Opportunity: $800 Billion+. Fit Score: 7.5/10", icon: "🛡️" },
    { type: 'paragraph', text: "Pure trust-based industry where referrals are the primary source of high-closing leads. Exceptional Lifetime Value through multi-policy bundling." },
    { type: 'bullets', items: [
      { bold: "Check-in Trigger", text: "Triggered when a new policy is 'Bound' or a renewal is processed." },
      { bold: "Target Integrations", text: "Vertafore (AMS360), Applied Systems (Epic), Better Agency." },
      { bold: "Sales Angle", text: "Insurance agents live and die by referrals. 'When was the last time you systematically asked every policyholder to refer a friend? With Referrizer, it happens automatically after every renewal.'" },
    ]},
  ],

  "2-5e": [
    { type: 'heading', text: "Total Addressable Market — The Full Picture" },
    { type: 'paragraph', text: "When you add up every vertical where Referrizer's Check-in Trigger creates automated value, the total addressable market is staggering. As a sales rep, understanding this TAM gives you confidence: you're not selling a niche tool — you're selling a platform positioned to capture a multi-trillion dollar market." },
    { type: 'table', headers: ["Industry", "Market Size (2026)", "Check-in Frequency", "Avg. Ticket", "Key Integration", "Fit Score"], rows: [
      ["Fitness & Wellness", "$38.6B (US)", "3–5x/week", "$50–$80/mo", "Native / POS", "10/10"],
      ["Home Services", "$463B (US)", "Variable per job", "$2,500–$15K+", "ServiceTitan", "9/10"],
      ["Pet Care", "$5.37B (N. America)", "3-5x/week", "$300/event", "Gingr", "9.5/10"],
      ["Auto Repair/Detailing", "$380B (N. America)", "2–4x/year", "$800+", "Shopmonkey", "8/10"],
      ["Insurance (P&C)", "$800B+", "1–2x/year", "$1,500+", "Vertafore", "7.5/10"],
    ]},
    { type: 'callout', text: "Combined TAM: Over $1.9 Trillion in North America alone. When you include global expansion markets (UK, Australia, Canada, EU), the number exceeds $2.9 Trillion.", icon: "🌍" },
    { type: 'heading', text: "Zapier Trigger Strategy" },
    { type: 'paragraph', text: "While native integrations are being built, Zapier provides immediate market access. Any CRM that supports Zapier triggers can connect to Referrizer's Check-in Trigger today. This means you can sell into Home Services and Auto Repair NOW using Zapier, while the native integrations are developed. It's not as seamless as native, but it opens the door to millions of potential customers immediately." },
    { type: 'heading', text: "PLG + ICP Expansion = Blue Ocean" },
    { type: 'paragraph', text: "Our expanded ICP combined with the Product-Led Growth unbundling strategy creates a blue ocean. We're not competing with Podium for gym clients anymore — we're competing for a $2.9 trillion market with modular entry points from $50/mo. No other company in the market has the Check-in Trigger engine, the full marketing loop (Referrizer + We Rank Higher + True Conversions), AND modular pricing. We are uniquely positioned." },
    { type: 'heading', text: "Growth Channels Beyond Direct Sales" },
    { type: 'bullets', items: [
      { bold: "Product-Led Growth (PLG)", text: "Self-serve signups through unbundled entry tiers. In-app upsell ladders drive expansion revenue automatically." },
      { bold: "Affiliate & Partnership Channels", text: "CRM integration partners become distribution channels. Their users discover Referrizer through the marketplace." },
      { bold: "AI Agents & Outbound Automation", text: "AI-powered prospecting and outreach that identifies high-fit businesses and initiates the sales conversation at scale." },
      { bold: "Human Business Development", text: "Strategic BD reps focused on enterprise and multi-location franchise deals across expansion verticals." },
    ]},
  ],

  "2-7": [
    { type: 'heading', text: "Competitive Battlefield — We Beat Everyone" },
    { type: 'paragraph', text: "You will face competitors on almost every deal. We aren't just competing; we are disrupting established players across every category. Here's your comprehensive battle card for every competitor you'll encounter." },
    { type: 'table', headers: ["Category", "Top Competitors", "Referrizer's Strategic Advantage", "Their Weakness"], rows: [
      ["SMS", "SimpleTexting, EZ Texting", "Built for local foot-traffic; instant upgrade to Reputation", "Purely 'point solutions' with no loyalty/reputation integration"],
      ["Email", "Mailchimp, Constant Contact", "Flat-rate pricing; no 'growth penalty' for larger lists", "Predatory tiers that skyrocket as contact lists grow"],
      ["Reputation & Messaging", "Podium, Birdeye", "All-in-one at $199 vs $289+ for messaging, reviews, and webchat alone", "Strong in messaging, reviews, and web chat, but lack loyalty programs, referral engines, automated campaigns, and CRM/lead enrichment. Higher price point for fewer growth tools"],
      ["Loyalty", "Fivestars, Yotpo", "No proprietary hardware; ties reviews to loyalty points", "High setup costs; forced hardware rentals"],
      ["Full Platform", "GoHighLevel, Keap", "Out-of-the-box simplicity; zero technical barrier", "Overwhelming complexity; requires agency setup"],
      ["Local Marketing", "Broadly, Thryv", "Modern UI, focused features, transparent pricing", "Expensive, bloated, poor UX, hidden fees"],
    ]},
    { type: 'heading', text: "Head-to-Head Scripts" },
    { type: 'heading', text: "The Killer Question" },
    { type: 'paragraph', text: "When a prospect mentions ANY competitor, ask: 'How long have you been using them? What would you change about the experience if you could?' This shifts from comparison to pain — and pain is where we win." },
    { type: 'callout', text: "NEVER trash-talk competitors. Instead, ask questions that let the prospect discover the gaps themselves. The most convicted person in the room WINS.", icon: "💡" },
  ],

  "2-8": [
    { type: 'heading', text: "We Rank Higher: SEO & Web Deep Dive" },
    { type: 'paragraph', text: "We Rank Higher is the organic visibility arm of the Referrizer ecosystem. When a potential customer searches 'gym near me' or 'best dentist in [city],' We Rank Higher makes sure our clients show up first. Without visibility, even the best reputation and loyalty programs are invisible." },
    { type: 'heading', text: "Core Services" },
    { type: 'bullets', items: [
      { bold: "SEO (Search Engine Optimization)", text: "Keyword research, on-page optimization, content strategy, and link building that drives organic traffic month after month." },
      { bold: "WordPress Development", text: "Fast, mobile-optimized WordPress sites built for conversion, not just aesthetics. We focus primarily on WordPress for optimization and migrations." },
      { bold: "Google Business Profile Optimization", text: "Complete GBP setup and ongoing management — the #1 driver of local search visibility. Categories, attributes, posts, Q&A, and photo optimization." },
      { bold: "Website Health Monitoring", text: "Speed, security, uptime, and technical SEO monitoring with automated alerts when something breaks." },
      { bold: "Content Marketing", text: "Blog posts, landing pages, and location-specific content that ranks for high-intent local keywords." },
    ]},
    { type: 'heading', text: "Why SEO Matters for Every Sale" },
    { type: 'paragraph', text: "Every Referrizer client needs SEO. If they're paying for ads (True Conversions) but their website is slow and unoptimized, they're burning money. If they're getting great reviews (Referrizer) but nobody can find them on Google, those reviews are invisible. We Rank Higher completes the loop." },
    { type: 'heading', text: "The Cross-Sell Opportunity" },
    { type: 'paragraph', text: "Selling We Rank Higher alongside Referrizer increases average deal size by 40–60%. It's the easiest cross-sell in the ecosystem. When a business owner sees their Google reviews improving with Referrizer, the natural next question is: 'How do I get more people to find us on Google?' That's your opening for We Rank Higher." },
    
  ],

  "2-9": [
    { type: 'heading', text: "True Conversions: Ads & Funnels Deep Dive" },
    { type: 'paragraph', text: "True Conversions is the paid acquisition engine. While Referrizer retains and We Rank Higher ranks, True Conversions drives immediate traffic through strategic paid advertising and conversion-optimized funnels. This is the 'instant results' play." },
    { type: 'heading', text: "Core Services" },
    { type: 'bullets', items: [
      { bold: "Google Ads", text: "Search, display, and local service ads that put clients at the top of Google results instantly. Perfect for businesses that can't wait for SEO." },
      { bold: "Social Media Advertising", text: "Meta (Instagram/Facebook), Google, and LinkedIn with advanced targeting for local audiences." },
      { bold: "Landing Page Design", text: "Conversion-optimized pages with A/B testing, lead capture forms, and social proof. Every ad dollar drives to a page designed for one action." },
      { bold: "Conversion Tracking", text: "Meta Pixel, Google Tag, and analytics that measure every dollar spent and every lead generated." },
      { bold: "Nurture Sequences", text: "Email and SMS drip campaigns that convert leads who didn't buy on the first visit." },
    ]},
    { type: 'heading', text: "The Funnel Flow" },
    { type: 'steps', steps: [
      { step: "Ad → Landing Page", description: "Targeted ads drive traffic to a page designed for one action: submit your info." },
      { step: "Lead Capture → CRM", description: "Form submission triggers text/email confirmation and adds the lead to the Referrizer pipeline." },
      { step: "Nurture → Conversion", description: "5-email sequence over 14 days warms cold leads into warm prospects." },
      { step: "Conversion → Retention (Referrizer)", description: "Once converted, the customer enters Referrizer's loyalty/review/referral loop. The marketing loop closes." },
    ]},
    { type: 'heading', text: "The Complete Ecosystem Pitch" },
    { type: 'paragraph', text: "When you can sell all three — True Conversions for immediate traffic, We Rank Higher for long-term organic visibility, and Referrizer for retention and referrals — you're offering a business owner the complete growth engine. No single competitor offers this ecosystem. Average deal size for a three-product sale is 3–4x a standalone Referrizer deal." },
    { type: 'callout', text: "The three-product pitch: 'True Conversions gets people in the door this week. We Rank Higher makes sure people find you on Google forever. Referrizer makes sure every customer who walks in becomes a loyal advocate who refers their friends. Together, you never stop growing.'", icon: "⚡" },
  ],

  // ===== DAY 3 =====
  "3-1": [
    { type: 'paragraph', text: "The single most important skill in lead management is knowing who deserves your time and who doesn't. We divide every lead into two categories: Prospects and Suspects." },
    { type: 'heading', text: "The Definition" },
    { type: 'bullets', items: [
      { bold: "Prospect", text: "Someone who can realistically close within 30 days. They have a need, interest, budget, and authority to make a decision. These people get your full energy." },
      { bold: "Suspect", text: "Someone who is 31+ days out from a decision. They may be interested, but they lack urgency, budget, or decision-making authority right now. They go into nurture — not into your active pipeline." },
    ]},
    { type: 'callout', text: "Treat this distinction like a religion. The #1 reason reps fail is spending 80% of their time on Suspects who will never close this month.", icon: "⚠️" },
    { type: 'heading', text: "How to Categorize in Practice" },
    { type: 'paragraph', text: "During your qualification call, you'll use the NIMTC framework to determine which category they fall into. If they pass all five tests — Needs, Interest, Money, Time, Commitment — they're a Prospect. If they fail on Time or Money, they're a Suspect who gets nurtured." },
    { type: 'heading', text: "The Pipeline Rule" },
    { type: 'paragraph', text: "Your active pipeline should contain ONLY Prospects. Suspects go into an automated drip sequence managed by Referrizer's own marketing automation. When they warm up (clicking emails, visiting the website, responding to SMS), they get re-qualified and potentially promoted to Prospect status." },
  ],

  "3-2": [
    { type: 'paragraph', text: "NIMTC is the qualification framework you'll use on every single call. It stands for Needs, Interest, Money, Time, Commitment. Master this and you'll never waste an hour on a dead-end lead again." },
    { type: 'heading', text: "N — Needs" },
    { type: 'paragraph', text: "A Needs question is anything about their current situation. You're finding out what they're doing today and where the gaps are." },
    { type: 'examples', heading: "Example Needs Questions", examples: [
      "How are you managing your online reputation currently?",
      "In what ways have you implemented AI with your marketing?",
      "What are you doing to outrank the competition in SEO?",
      "Have you ever implemented consistent SMS or email campaigns?",
    ]},
    { type: 'heading', text: "I — Interest" },
    { type: 'paragraph', text: "An Interest question is about a like or want to change regarding their current situation." },
    { type: 'examples', heading: "Example Interest Questions", examples: [
      "What would you change about your current situation?",
      "If you could revamp all of your marketing, what would your dream scenario be?",
      "How would you like to see your Google rankings change?",
    ]},
    { type: 'heading', text: "M — Money" },
    { type: 'paragraph', text: "A Money question asks how much they are budgeting toward a new solution, or currently spending." },
    { type: 'examples', heading: "Example Money Questions", examples: [
      "What is your marketing budget for new partnerships?",
      "How much do you currently spend on online advertising?",
      "What are your customer acquisition costs?",
    ]},
    { type: 'heading', text: "T — Time" },
    { type: 'paragraph', text: "A Time question is anything that impacts your time or theirs — urgency, seasonality, deadlines." },
    { type: 'examples', heading: "Example Time Questions", examples: [
      "When do you want to have a reputation program in place?",
      "How much time can you or a staff member dedicate to managing the software?",
      "What are the busiest seasons of the year for your business?",
    ]},
    { type: 'heading', text: "C — Commitment" },
    { type: 'paragraph', text: "The pre-commitment establishes the purpose of closing business — not to waste anyone's time." },
    { type: 'callout', text: "The Pre-Commitment Script: 'When I'm able to prove excellent ROI with an all-in-one automation solution satisfying all of the described marketing needs, and of course keep it affordable, will we be in the position to earn your business today?'", icon: "🎯" },
  ],

  "3-3a": [
    { type: 'heading', text: "Welcome to Close CRM — Your Sales Command Center" },
    { type: 'paragraph', text: "Close is the CRM built specifically for salespeople who actually sell. Unlike bloated platforms that require months of setup, Close is designed for speed: built-in calling, email, SMS, and pipeline management — all in one screen. This is where every lead, every call, every deal lives." },
    { type: 'heading', text: "The Close Sidebar — Your Navigation Hub" },
    { type: 'paragraph', text: "When you log into Close, the left sidebar is your command center. Here's what each section does:" },
    { type: 'bullets', items: [
      { bold: "Inbox", text: "Your centralized communication hub. Every email, SMS, call notification, and task surfaces here. Think of it as your daily action center — the first thing you check every morning." },
      { bold: "Opportunities", text: "Your pipeline view. See every active deal, its stage, value, and expected close date. Drag deals between stages as they progress." },
      { bold: "Leads", text: "The master database. Every business you're selling to lives here. Click any lead to see contacts, communication history, tasks, notes, and opportunities — all on one page." },
      { bold: "Contacts", text: "Individual people within leads. A lead might be 'FitZone Gym' but contacts are 'Mike Johnson (Owner)' and 'Sarah Smith (Manager).' Always sell to contacts, not leads." },
      { bold: "Activities", text: "A timeline of everything that happened: calls made, emails sent, tasks completed, notes added. Use this to review your daily output." },
      { bold: "Conversations", text: "Threaded view of all email and SMS conversations across all leads. Perfect for catching up on replies." },
      { bold: "Workflows", text: "Your automation engine. Build multi-step sequences that combine email, SMS, calls, and tasks to systematically work leads." },
      { bold: "Reports", text: "Activity reports, funnel analysis, pipeline value, and team performance dashboards. Data drives decisions." },
    ]},
    { type: 'heading', text: "The Lead Record — Everything in One Place" },
    { type: 'paragraph', text: "Click any lead and you see the full picture: company info, all contacts, every email/call/SMS exchanged, active opportunities, tasks, notes, and custom fields. You should NEVER need to leave Close to find information about a deal." },
    { type: 'heading', text: "Customizing Close for Referrizer" },
    { type: 'paragraph', text: "Close becomes powerful when customized to match YOUR sales process. Here's what's been configured for our team:" },
    { type: 'bullets', items: [
      { bold: "Lead Statuses", text: "Our pipeline uses specific lead statuses: New Lead → Contacted → Qualified (Prospect) → Demo Scheduled → Demo Completed → Negotiation → Won → Lost. Each status tells you exactly where the deal stands." },
      { bold: "Custom Fields", text: "Fields like 'Industry Vertical,' 'Number of Locations,' 'Current Marketing Spend,' and 'Decision Maker Confirmed' help you qualify and filter leads instantly." },
      { bold: "Custom Activities", text: "Beyond standard calls and emails, we track 'Qualification Calls,' 'Demo Completed,' and 'Follow-Up Attempts' as custom activity types for granular reporting." },
    ]},
    { type: 'callout', text: "Pro Tip: When you open a lead, scan the right sidebar for open tasks first. Tasks are your daily priorities — never let a task go overdue.", icon: "💡" },
  ],

  "3-3b": [
    { type: 'heading', text: "Smart Views — The Secret Weapon of Top Performers" },
    { type: 'callout', text: "Smart Views are to Close what coffee is to a salesperson. You can get through your day without them, but why would you want to?", icon: "☕" },
    { type: 'paragraph', text: "Smart Views are saved lead filters that create dynamic, actionable lists. They update automatically as lead data changes. Instead of scrolling through thousands of leads, Smart Views surface exactly the leads you need to work RIGHT NOW." },
    { type: 'heading', text: "How Smart Views Work" },
    { type: 'steps', steps: [
      { step: "1. Open Leads", description: "Navigate to the Leads section in the sidebar." },
      { step: "2. Add Filters", description: "Click 'Filters' to add conditions: lead status, date of last activity, custom field values, contact info, communication history, and more." },
      { step: "3. Combine Conditions", description: "Stack multiple filters with AND/OR logic. Example: Lead Status = 'Qualified' AND Last Activity > 7 days ago AND Industry = 'Fitness.'" },
      { step: "4. Save as Smart View", description: "Click 'Save as Smart View' and give it a descriptive name. It appears in your sidebar under Smart Views." },
    ]},
    { type: 'heading', text: "Essential Smart Views for Your Daily Workflow" },
    { type: 'table', headers: ["Smart View Name", "Filter Logic", "Purpose"], rows: [
      ["Today's Follow-Ups", "Task due date = Today", "Start your morning here. Work every task before doing anything else."],
      ["Hot Prospects (No Contact 3+ Days)", "Status = Qualified + Last Activity > 3 days", "Prospects going cold. Call them NOW before they forget you."],
      ["Demo Scheduled This Week", "Status = Demo Scheduled + Opportunity close date = This week", "Prep for upcoming demos — review notes, prep FABs."],
      ["New Leads (Uncontacted)", "Status = New Lead + No calls/emails", "Fresh leads that haven't been touched. First contact = highest priority."],
      ["Leads Untouched 12+ Months", "Last activity > 12 months ago", "Resurrection candidates. Run a re-engagement Workflow against this list."],
      ["Won Deals (Last 30 Days)", "Status = Won + Close date = Last 30 days", "Cross-sell opportunities. They bought Referrizer — pitch WRH and TC."],
    ]},
    { type: 'heading', text: "Smart Views + Intentional Outreach = Results" },
    { type: 'paragraph', text: "Create a Smart View of all leads you need to call, then work through the list with purpose — researching each prospect, personalizing your approach, and having meaningful conversations. Quality over quantity. AEs who prepare before each call close at 2-3x the rate of those who dial blindly." },
    { type: 'callout', text: "Your Smart Views ARE your daily plan. If you're ever unsure what to do next, open a Smart View and start working the list. No guesswork, no wasted time.", icon: "🎯" },
  ],


  "3-5a": [
    { type: 'heading', text: "Close Communication Hub — Call, Email & Text Without Leaving the CRM" },
    { type: 'paragraph', text: "Close is one of the only CRMs with built-in calling, email, and SMS. This means every communication happens inside Close and is automatically logged against the lead. No copy-pasting call notes, no searching Gmail — everything is captured and searchable." },
    { type: 'heading', text: "Built-In Calling" },
    { type: 'paragraph', text: "Close has a full phone system built in. You get a dedicated phone number, voicemail, call recording, and transcription — all connected to your leads." },
    { type: 'bullets', items: [
      { bold: "One-Click Calling", text: "Click any phone number on a lead to call instantly. The call is recorded (with consent), transcribed by AI, and logged automatically." },
      { bold: "Call Assistant (AI)", text: "Close's AI automatically transcribes calls and generates summaries. After every call, you get a searchable transcript and key points without manual note-taking." },
      { bold: "Voicemail Drop", text: "Pre-record voicemail messages and drop them with one click when you hit voicemail. Saves time and ensures a consistent, professional message every time." },
    ]},
    { type: 'heading', text: "Email in Close" },
    { type: 'bullets', items: [
      { bold: "Connected Email", text: "Your work email (Gmail/Outlook) syncs with Close. Every email sent to or from a lead is automatically logged — even if you send it from Gmail directly." },
      { bold: "Templates & Snippets", text: "Create reusable email templates for common messages (intro emails, follow-ups, proposals). Snippets let you insert pre-written blocks of text anywhere with a shortcut." },
      { bold: "Bulk Email", text: "Select a Smart View and send personalized emails to the entire list at once. Merge fields auto-fill each lead's name, company, and custom field values." },
      { bold: "Scheduling & Reminders", text: "Schedule emails to send later (best times for open rates) and set follow-up reminders so no lead falls through the cracks." },
    ]},
    { type: 'heading', text: "SMS in Close" },
    { type: 'bullets', items: [
      { bold: "Two-Way SMS", text: "Send and receive text messages directly from Close. SMS conversations appear alongside email and call history on the lead record." },
      { bold: "SMS Templates", text: "Create templates for common texts: meeting confirmations, quick check-ins, follow-up nudges." },
      { bold: "MMS Support", text: "Send images and files via text — great for sharing one-pagers, screenshots of results, or promotional materials." },
    ]},
    { type: 'callout', text: "Daily Communication Rhythm: Start with Inbox → Clear tasks → Work through your 'Hot Prospects' Smart View with intentional calls → Send follow-up emails → End with SMS nudges to leads who didn't answer.", icon: "📞" },
  ],

  "3-5b": [
    { type: 'heading', text: "Workflows — Your Automated Sales Machine" },
    { type: 'paragraph', text: "Workflows in Close are automated sequences that combine email, SMS, calls, and tasks into a step-by-step outreach cadence. Instead of manually remembering to follow up, Workflows do it for you — consistently and at scale." },
    { type: 'heading', text: "How Workflows Work" },
    { type: 'steps', steps: [
      { step: "1. Create a Workflow", description: "Go to Workflows in the sidebar. Click 'Create Workflow.' Give it a descriptive name like 'New Lead 7-Day Outreach.'" },
      { step: "2. Add Steps", description: "Build your sequence: Day 1 = Email intro. Day 2 = Call attempt. Day 3 = SMS follow-up. Day 5 = Email #2. Day 7 = Final call + breakup email if no response." },
      { step: "3. Set Triggers", description: "Define what enrolls leads: lead status change, manual enrollment, or Smart View membership." },
      { step: "4. Personalize", description: "Use merge fields ({{contact.first_name}}, {{lead.company}}) to personalize every touchpoint automatically." },
      { step: "5. Launch & Monitor", description: "Activate the Workflow and monitor open rates, reply rates, and call connection rates from the Workflow dashboard." },
    ]},
    { type: 'heading', text: "Essential Workflows for Referrizer Sales" },
    { type: 'table', headers: ["Workflow Name", "Trigger", "Steps", "Goal"], rows: [
      ["New Lead Outreach", "New lead created", "Email → Call → SMS → Email → Call → Breakup", "First contact within 5 min, 7 touches in 10 days"],
      ["Post-Demo Follow-Up", "Status → Demo Completed", "Thank you email → 48hr check-in call → Proposal email", "Keep momentum after demo, prevent ghosting"],
      ["Re-Engagement Campaign", "No activity 60+ days", "Email: 'Still interested?' → SMS nudge → Final call", "Resurrect dead leads before they churn"],
      ["Referral Request", "Status → Won", "30-day check-in email → Referral ask → Review request", "Turn won deals into new pipeline"],
    ]},
    { type: 'heading', text: "Workflow Best Practices" },
    { type: 'bullets', items: [
      { bold: "Speed to Lead", text: "The first Workflow step should fire within 5 minutes of lead creation. Studies show response rates drop 80% after the first hour." },
      { bold: "Multi-Channel", text: "Don't rely on email alone. The best Workflows combine email + call + SMS. Different prospects prefer different channels." },
      { bold: "Exit Conditions", text: "Set leads to automatically exit a Workflow when they reply, book a demo, or their status changes. Never spam engaged prospects." },
      { bold: "A/B Test Subject Lines", text: "Create two versions of key emails and let Close split-test them. Small improvements in open rates compound into big pipeline gains." },
    ]},
    { type: 'callout', text: "The math: 100 new leads/month × 7-step Workflow = 700 automated touchpoints/month. That's the equivalent of hiring another rep — except Workflows never take a day off.", icon: "🤖" },
  ],

  "3-5c": [
    { type: 'heading', text: "Close Reporting — Data-Driven Selling" },
    { type: 'paragraph', text: "What gets measured gets managed. Close provides built-in reports that tell you exactly what's working, what's not, and where to focus your energy. Top performers check reports daily." },
    { type: 'heading', text: "Key Report Types" },
    { type: 'bullets', items: [
      { bold: "Activity Report", text: "Shows calls made, emails sent, SMS sent, and tasks completed — per rep, per day/week/month. This is how you measure effort." },
      { bold: "Funnel Report", text: "Tracks leads through each status stage. Shows conversion rates between stages: how many New Leads become Qualified? How many Demos become Won? Find the bottleneck." },
      { bold: "Pipeline Report", text: "Revenue forecast based on open Opportunities. Shows total pipeline value, weighted value, and deals by stage. Your manager reviews this weekly." },
      { bold: "Leaderboard", text: "Compare performance across the team: calls made, emails sent, deals won, revenue closed. Healthy competition drives results." },
    ]},
    { type: 'heading', text: "The Numbers That Matter" },
    { type: 'table', headers: ["Metric", "Target", "Why It Matters"], rows: [
      ["Calls/Day *", "20-40 quality calls", "As an AE, focus on meaningful conversations with qualified prospects — not call volume."],
      ["Emails/Day *", "30-50", "Follow-ups and outreach. Combined with calls for multi-channel coverage."],
      ["Demo-to-Close Rate", "30% - 100%", "Measures your demo effectiveness. Below 30%? Review your demo structure."],
      ["Speed to Lead", "< 5 minutes", "First contact speed is the #1 predictor of conversion."],
      ["Pipeline Coverage", "3x - 4x", "MRR Target is $4,000. Meaning your pipeline coverage goal is to aim for $12,000 to $16,000 in MRR opportunities."],
    ]},
    { type: 'callout', text: "📊 * If there are 4 attended demonstrations in a day, then Calls/Day and Emails/Day metrics will be nearly 0/0. When demos \"no-show,\" aim to achieve the baseline targets above.", icon: "📊" },
  ],

  // DAY 3: CRM Constitution & Lead Ownership Rules (from Global SOP)
  "3-ownership": [
    { type: 'heading', text: "CRM Constitution & Lead Ownership Rules" },
    { type: 'paragraph', text: "At Referrizer, lead ownership is not permanent. It is earned through consistent engagement. These rules protect the pipeline, prevent hoarding, and ensure every lead gets the attention it deserves." },
    { type: 'heading', text: "The 30-Day Active Engagement Pulse" },
    { type: 'paragraph', text: "If a lead shows no logged activity (calls, emails, SMS, tasks, status changes) for 30 consecutive days, ownership is automatically stripped. The lead returns to the House Account pool for reassignment. No exceptions. This prevents pipeline bloat and ensures active leads get active attention." },
    { type: 'callout', text: "Set a recurring task in Close CRM every 25 days for all your leads. If you cannot justify keeping a lead, release it. Hoarding leads you are not working hurts the entire team.", icon: "⚠️" },
    { type: 'heading', text: "The 14-Day Self-Policing Reassignment Protocol" },
    { type: 'paragraph', text: "If you recognize that a lead is not progressing and you cannot advance it within 14 days, you are expected to voluntarily reassign it. This is not a punishment. It is a professional courtesy that keeps the pipeline healthy. The lead goes back to the pool or to a teammate with a better angle." },
    { type: 'heading', text: "Lead Pool / House Account Claiming" },
    { type: 'bullets', items: [
      { bold: "Claiming Protocol", text: "Leads in the House Account pool are first-come, first-served. To claim a lead, you must log your first outreach within 24 hours. If you claim and do not reach out within 24 hours, the lead returns to the pool." },
      { bold: "No Cherry-Picking", text: "You may not claim more than 10 leads per day from the House Account. This prevents one rep from hoarding the best leads while others go hungry." },
    ]},
    { type: 'heading', text: "VIP and Corporate Vault Protection" },
    { type: 'paragraph', text: "Enterprise accounts (3+ locations) and strategic partnerships are placed in the Corporate Vault. These leads are assigned by the VP of Sales only. Do not contact Vault leads without explicit assignment. Cross-departmental leads (e.g., a CS upsell opportunity) follow the 90-Day Closer Ownership rule." },
    { type: 'heading', text: "90-Day Closer Ownership" },
    { type: 'bullets', items: [
      { bold: "All Upsells Credited", text: "For 90 days after closing a deal, all upsells on that account are credited to the original closer. This incentivizes proper onboarding and relationship building." },
      { bold: "No Upselling During Onboarding", text: "No one may upsell a new client during their onboarding period except the original closer. Customer Success should focus on activation, not revenue." },
      { bold: "Referral Bonus Eligibility", text: "Referral bonuses from a closed account are only available after the 91st day. This prevents gaming the system with immediate referral harvesting." },
    ]},
  ],

  // ===== DAY 4 — DEMO PREPARATION & SALES PROCESS =====
  
  // PHASE 1: The Mindset & Preparation
  "4-p1-read": [
    { type: 'quote', text: "Success is 80% Psychology, 20% Skill.", author: "Tony Robbins" },
    { type: 'heading', text: "Positivity as a Pattern Interrupt" },
    { type: 'paragraph', text: "Before you ever pick up the phone or open a Zoom call, your mental state determines the outcome. Research from Harvard shows that a positive brain is 31% more productive than a negative, neutral, or stressed brain. Positivity isn't 'soft' — it's a competitive weapon." },
    { type: 'heading', text: "The 4 Stages of Competence" },
    { type: 'steps', steps: [
      { step: "Stage 1: Unconscious Incompetence", description: "You don't know what you don't know. You think you're fine, but you're leaving money on the table." },
      { step: "Stage 2: Conscious Incompetence", description: "You now realize what you're missing. This is uncomfortable but necessary — awareness precedes improvement." },
      { step: "Stage 3: Conscious Competence", description: "You can do it, but you have to think about every step. It requires effort and concentration." },
      { step: "Stage 4: Unconscious Competence", description: "Mastery. You execute on reflex — like driving a car. This is the goal of this entire 10-day program." },
    ]},
    { type: 'callout', text: "The Harvard Written Goal Study: People who wrote down goals, created action plans, had accountability partners, and sent weekly progress reports achieved their goals 76% more often. Written goals with accountability = elite performance.", icon: "📊" },
    { type: 'heading', text: "Real-World Example" },
    { type: 'paragraph', text: "The Harvard Written Goal Study divided participants into groups: those who simply thought about goals vs. those who wrote them down with accountability structures. The results were staggering — 76% higher achievement rates for the written + accountability group. As an Account Executive, your daily goal-setting routine is not optional." },
    { type: 'heading', text: "📋 Task: Write Your Top 10 Professional Goals" },
    { type: 'callout', text: "Take 10 minutes right now. Write down your top 10 professional goals — be specific, measurable, and time-bound. Then send them to your manager. Written goals with accountability are the single highest predictor of achievement.", icon: "✍️" },
    { type: 'steps', steps: [
      { step: "1. Write 10 Goals", description: "Be specific: 'Close 15 deals this quarter' not 'sell more.' Include revenue targets, skill milestones, and career ambitions." },
      { step: "2. Prioritize", description: "Rank them 1–10. Your top 3 should be non-negotiable daily focus items." },
      { step: "3. Send to Your Manager", description: "Email or Slack your list to your manager today. This creates accountability and opens the door for coaching alignment." },
      { step: "4. Review Weekly", description: "Every Friday, review progress against your goals. Adjust tactics, never the ambition." },
    ]},
  ],

  // PHASE 2: The Opening
  "4-p2-read": [
    { type: 'quote', text: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar" },
    { type: 'heading', text: "Establish the Decision Maker Immediately" },
    { type: 'paragraph', text: "The very first thing you must do on any demo or discovery call is establish who makes the decision. Never pitch to someone who can't say yes." },
    { type: 'callout', text: "The Golden Question: 'Other than yourself, is there anyone else involved in choosing new marketing programs?' If they say no: 'So I'm in good hands then…' This question must be asked within the first 2 minutes.", icon: "🏆" },
    { type: 'heading', text: "Qualify Using NIMTC" },
    { type: 'paragraph', text: "NIMTC is a guideline for question-asking that leads toward qualification. Use it as a framework to structure your discovery, not a rigid checklist." },
    { type: 'bullets', items: [
      { bold: "Needs", text: "What is their biggest challenge? What problem keeps them up at night?" },
      { bold: "Interest", text: "What would they change about their current situation? What does their dream scenario look like?" },
      { bold: "Money", text: "What are they currently spending on marketing? What would they invest if ROI was proven?" },
      { bold: "Time", text: "When do they want results? Is there a seasonal urgency?" },
      { bold: "Commitment", text: "If ROI is demonstrated and the investment is fair, are they prepared to move forward today?" },
    ]},
    { type: 'heading', text: "Deep Listening Required" },
    { type: 'paragraph', text: "Listen for personal life, health, or financial crises. Listen for frustration with current vendors. Listen for desire, not just need. Do NOT jump into the product — the opening should last several minutes of genuine conversation." },
  ],

  // PHASE 3: The Discovery
  "4-p3-read": [
    { type: 'heading', text: "Sales Is the Art of Asking Questions" },
    { type: 'paragraph', text: "Pain qualifies leads and enables solutions. Without uncovering real pain, you're a commodity competing on price. With pain, you're a consultant delivering transformation." },
    { type: 'heading', text: "The Challenger Sale Approach" },
    { type: 'paragraph', text: "The Challenger methodology has three pillars: Teach, Tailor, Take Control. The best AEs don't just listen — they teach prospects something new about their own business, tailor insights to their specific situation, and take control of the conversation's direction." },
    { type: 'callout', text: "Reframing Example: When a prospect says 'We're on page 2 of Google,' reframe it as a 'Competitor Subsidy.' Every day they're on page 2, they're funding their competitors' growth on page 1. That's not a ranking problem — that's a revenue leak.", icon: "💡" },
    { type: 'heading', text: "Pain = Profit" },
    { type: 'bullets', items: [
      { bold: "Pain qualifies", text: "If there's no pain, there's no urgency. No urgency = no close." },
      { bold: "Pain enables solutions", text: "You can't propose a solution until you've diagnosed the problem." },
      { bold: "Healing pain creates loyalty", text: "When you solve a real problem, the customer never leaves." },
      { bold: "Understanding pain reduces churn", text: "If we only hear surface-level issues, we become replaceable." },
    ]},
    { type: 'paragraph', text: "Dig for the emotional root. Surface-level answers like 'We need more leads' are starting points, not endpoints. Ask: Why? What happens if you don't get more leads? How does that affect you personally?" },
  ],

  // PHASE 4: The Body (Inverted Pyramid)
  "4-p4-read": [
    { type: 'heading', text: "The Inverted Pyramid: Show the Biggest Value First" },
    { type: 'paragraph', text: "Never give a button-clicking feature tour. Lead with outcome, not with process. A shotgun demo, where you simply cover every single product and feature hoping something will resonate, is the fastest way to lose a prospect's attention. Be a sniper, and aim to kill. Don't throw spaghetti at the wall and hope some of it sticks. Learn how to present in the body what you discover in the opening." },
    { type: 'heading', text: "Primary Demo Focus: Referrizer Packages" },
    { type: 'bullets', items: [
      { bold: "Reputation", text: "Google Review Reputation Management, Reputation Progress Tracker & Dashboard, Review Capture Link, AI Assist Review Response, Website Homepage Lead Capture Pop-Up, Email Marketing Automation for Review Capture, SMS Campaign Management, Client Check-In w/ SMS Engagement, ROI Dashboard, 500 SMS Review Requests Per Month." },
      { bold: "Premium", text: "Referral, Loyalty, and Reputation Management Tools, Email, Text Campaigns and Automation, Smart Line, Quick Connect, Inbox, Dashboard Overview, Chat & Phone Support, 3 x 1-hour onboarding calls with a marketing expert, Free one-time Meta Ads Audit, Free one-time Website Audit, Free one-time SEO Audit, Website Homepage Lead Capture Pop-Up." },
      { bold: "Premium PLUS", text: "Referral, Loyalty, and Reputation Management Tools, Email, Text Campaigns and Automation, Smart Line, Quick Connect, Inbox, Dashboard Overview, Chat & Phone Support, 3 x 1-hour onboarding calls with a marketing expert, Free one-time Meta Ads Audit, Free one-time Website Audit, Free one-time SEO Audit, AI Employee & Messaging Automation, Website Homepage Lead Capture Pop-Up, Pipeline & CRM Dashboard." },
      { bold: "Platinum", text: "Everything in Premium PLUS, including a dedicated marketing expert executing done-for-you campaigns built on proven best practices from thousands of successful Referrizer customers. You bring the business, we bring the strategy, the execution, and the results." },
    ]},
    { type: 'heading', text: "FABs, Tie-Downs & Trial Closes" },
    { type: 'paragraph', text: "Use the FAB formula: 'Because of [Feature], you can [Advantage], which means to you [Benefit].' Follow each FAB with a tie-down (Isn't it? Doesn't it? Couldn't it?) to get a 'Little Yes.' Accumulate little yeses toward the big yes." },
    { type: 'examples', heading: "Trial Close Examples", examples: [
      "Do you want to run the campaigns yourself, or would you prefer us to handle it?",
      "How is this sounding so far?",
      "Can you see how this would help with [their specific pain]?",
    ]},
  ],

  // PHASE 5: Handling Objections
  "4-p5-read": [
    { type: 'heading', text: "Smokescreens vs. Conditions" },
    { type: 'paragraph', text: "A smokescreen is a reflex — 'not interested,' 'too busy,' 'send me an email.' A condition is a hard stop that cannot be overcome — bankruptcy, complete disqualification. Your job is to determine which is which." },
    { type: 'heading', text: "The 6-Step Objection Handling Reflex" },
    { type: 'steps', steps: [
      { step: "1. Hear Them Out", description: "Let them talk. Don't interrupt. Don't prepare your rebuttal while they speak. Actually listen." },
      { step: "2. Rephrase It", description: "Repeat their concern back: 'So what you're saying is…' This proves you listened." },
      { step: "3. Isolate It", description: "'Other than this, is there anything else preventing us from moving forward?' Ensure it's the ONLY objection." },
      { step: "4. Handle It", description: "Address the specific concern — value justification, testimonial, risk reversal, or ROI reframing." },
      { step: "5. Make Sure You Handled It", description: "'Does that address your concern?' Never assume it's resolved just because you gave an answer." },
      { step: "6. Roll On and Close", description: "Once confirmed, transition immediately back to the close. Dwelling on a resolved objection brings it back to life." },
    ]},
    { type: 'callout', text: "ROI Reframe: If the system brings in just ONE new customer per month — and average clients see 15-20 — that one customer alone pays for the entire platform many times over. This isn't an expense, it's an investment.", icon: "💰" },
  ],

  // PHASE 6: The Close & Vision
  "4-p6-read": [
    { type: 'heading', text: "Summarize the Value" },
    { type: 'paragraph', text: "This is where you bring it home. Connect pain and qualification to solutions and desired outcomes. Challenge and inspire them with a vision they couldn't see themselves." },
    { type: 'heading', text: "The Ben Franklin Close" },
    { type: 'paragraph', text: "Draw a T-chart: Yes reasons on the left, No reasons on the right. Walk through everything you've discussed. The Yes column always wins when you've done proper discovery." },
    { type: 'callout', text: "RULE: A demo should never take more than 45 minutes unless you are actively closing the deal. Respect their time, and they'll respect your recommendation.", icon: "⏱️" },
    { type: 'heading', text: "Creating the Vision" },
    { type: 'paragraph', text: "Tie their deep emotional pain from the opening directly to the exact Referrizer package outcome. Paint a picture of their business 90 days from now: more reviews, automated campaigns running, referral revenue compounding, and TIME back in their day." },
    { type: 'script', label: "Closing Statement Example", lines: [
      { speaker: "You", text: "You told me you're working 60-hour weeks and still manually texting customers. With the Premium PLUS plan, every single one of those follow-ups happens automatically. In 90 days, you'll have 40+ new Google reviews, a loyalty program running on autopilot, and a referral engine generating new customers while you sleep. The question isn't whether you can afford $299/month — it's whether you can afford to keep losing $5,000/month doing it manually." },
    ]},
    { type: 'paragraph', text: "Create urgency by connecting time to money. Every day they wait is another day of manual work and lost revenue." },
  ],

  // DAY 4: The 100-Point Demo Scoring System (from Demo Excellence SOP)
  "4-scoring": [
    { type: 'heading', text: "The 100-Point Demo Scoring System" },
    { type: 'paragraph', text: "Every demo you deliver is scored on a 100-point scale. This is not optional. This is how we measure demo excellence and identify coaching opportunities. Your target average is 70+ points. Consistently falling below 70 triggers a Performance Improvement Plan." },
    { type: 'heading', text: "70 Points: Structural Integrity (7 Steps x 10 Points Each)" },
    { type: 'table', headers: ["Step", "Points", "What's Measured"], rows: [
      ["1. Rapport & Obligation", "10", "Professional opening, Obligation Statement delivered, tone and energy set"],
      ["2. Qualify (NIMTC)", "10", "All 5 pillars addressed, decision-maker confirmed, pre-commitment secured"],
      ["3. Probe & Discovery", "10", "Pain uncovered, emotional root reached, Challenger reframe delivered"],
      ["4. Demo Body (Inverted Pyramid)", "10", "Led with biggest value, FABs tied to pain, Trial Closes used"],
      ["5. Decision Maker Confirmed", "10", "Golden Question asked, stakeholder expansion handled if needed"],
      ["6. Objection Handling", "10", "6-Step Framework used, objections isolated and confirmed resolved"],
      ["7. Close", "10", "Appropriate close technique selected and executed with conviction"],
    ]},
    { type: 'heading', text: "30 Points: Execution Intelligence" },
    { type: 'bullets', items: [
      { bold: "Talk Ratio (10 pts)", text: "Target: 52-57% AE talk time. Below 50% means you are not guiding. Above 60% means you are lecturing. The sweet spot is consultative dialogue." },
      { bold: "Interruption Management (10 pts)", text: "Never interrupt the prospect mid-sentence. Pause 1.5-2 seconds after they finish before responding. Interruptions destroy trust and signal desperation." },
      { bold: "RefXP / Product Mastery (10 pts)", text: "Seamless navigation of the Referrizer platform during the demo. No fumbling, no 'let me find that,' no dead air while clicking around. Know the product cold." },
    ]},
    { type: 'callout', text: "PIP Threshold: Consistent scores below 70 trigger a Performance Improvement Plan. Consistent scores above 85 qualify you for Advanced Closer certification and premium lead assignments.", icon: "📊" },
    { type: 'heading', text: "Pre-Demo Technical Excellence (The 5-Minute Ready Rule)" },
    { type: 'bullets', items: [
      { bold: "5 Minutes Before Every Demo", text: "Test your internet connection, webcam, microphone, and screen share. Open the Referrizer dashboard to the prospect's vertical. Have their Google listing pulled up. Have their competitor's listing ready for comparison." },
      { bold: "Audio Hygiene", text: "No background noise, no echo, no typing sounds. Use a headset. Mute when not speaking in group settings." },
      { bold: "Visual Readiness", text: "Professional background (real or virtual). Good lighting on your face. Camera at eye level. Dress as if meeting in person." },
    ]},
    { type: 'heading', text: "Post-Demo Protocols" },
    { type: 'bullets', items: [
      { bold: "5-Minute Follow-Up", text: "Within 5 minutes of hanging up, send a personalized thank-you email with a recap of key pain points discussed and the specific Referrizer package recommended." },
      { bold: "Loom Recap (Optional but Powerful)", text: "Record a 60-second Loom video summarizing the demo highlights and next steps. Prospects who receive a video recap close at significantly higher rates." },
      { bold: "24-Hour Disposition", text: "Update the lead status in Close CRM within 24 hours. Log the demo as a Custom Activity. Set follow-up tasks. No lead should sit in 'Demo Completed' without a next action." },
      { bold: "Multi-Threading", text: "If there are multiple stakeholders, send a separate follow-up to each with content tailored to their role (owner gets ROI, manager gets ease-of-use, staff gets time savings)." },
    ]},
  ],

  // ===== DAY 5 =====
  "5-1": [
    { type: 'paragraph', text: "Not all objections are created equal. Before you can handle an objection, you need to identify what TYPE it is. There are five categories, and each requires a different response." },
    { type: 'heading', text: "1. Smokescreens" },
    { type: 'paragraph', text: "Smokescreens are anything designed to get rid of you. They're not real objections — they're reflexive defenses." },
    { type: 'examples', heading: "Examples", examples: ["'No soliciting'", "'We're not interested'", "'The person you need to talk to is on vacation'", "'We're all set'"] },
    { type: 'callout', text: "Treat ALL initial objections as smokescreens until you find out more info. Anger means cure — you want emotion. Apathy does not provide a hook.", icon: "💡" },
    { type: 'heading', text: "2. Obstacles" },
    { type: 'paragraph', text: "Something the customer thinks you can't overcome — but you CAN." },
    { type: 'examples', heading: "Examples", examples: ["'We have someone doing our SEO already'", "'We just had our website redone last month'", "'We tried SMS programs in the past, and it was a nightmare'"] },
    { type: 'heading', text: "3. Serious Concerns" },
    { type: 'paragraph', text: "Something that stops the selling process and MUST be addressed immediately before moving on." },
    { type: 'examples', heading: "Examples", examples: ["'I met someone from your company before, and they were like a used car salesman'", "'We used Referrizer in the past, and didn't have the best experience'", "'Someone else just sent me a promotion for $249, and you're telling me $399?'"] },
    { type: 'heading', text: "4. Questions" },
    { type: 'paragraph', text: "Questions are buying signs or requests for more information. Answer immediately or respond with a clarifying question." },
    { type: 'examples', heading: "Examples", examples: ["'Do you build websites?'", "'What is your international SMS rate?'"] },
    { type: 'callout', text: "ALWAYS think deeply about WHY the question is asked. Practice listening and formulating the perfect follow-up question to keep control.", icon: "🧠" },
    { type: 'heading', text: "5. Conditions" },
    { type: 'paragraph', text: "Conditions are objections that CANNOT be overcome. Bankruptcy (hard condition) or complete disqualification (soft condition). When you hit a true condition, move on — don't force it." },
  ],

  "5-2": [
    { type: 'callout', text: "VERBATIM: Hear them out → Rephrase it → Isolate it → Handle it → Make sure you handled it → Roll on and close.", icon: "🧠" },
    { type: 'heading', text: "Step 1: Hear Them Out" },
    { type: 'paragraph', text: "Let the prospect talk. Don't interrupt. Don't prepare your rebuttal while they're speaking. Actually listen. People need to feel heard before they'll hear you." },
    { type: 'heading', text: "Step 2: Rephrase It" },
    { type: 'paragraph', text: "Repeat their concern back in your own words. This proves you listened and clarifies you're addressing the right issue." },
    { type: 'script', label: "Rephrase Example", lines: [
      { speaker: "Prospect", text: "We've tried marketing software before and it never delivered what was promised." },
      { speaker: "You", text: "So what you're saying is you've had a negative experience with a previous provider, and you want to make sure that doesn't happen again. Is that fair?" },
    ]},
    { type: 'heading', text: "Step 3: Isolate It" },
    { type: 'paragraph', text: "Ask: 'Other than [their concern], would there be any other reason why we could not go forward with the contract today?' This ensures you're not chasing one objection only to have another appear." },
    { type: 'heading', text: "Step 4: Handle It" },
    { type: 'paragraph', text: "Address the specific objection with the appropriate technique — whether it's a value justification, a testimonial, a competitive comparison, or a risk reversal." },
    { type: 'heading', text: "Step 5: Make Sure You Handled It" },
    { type: 'paragraph', text: "Confirm the objection is resolved: 'Does that address your concern?' or 'Are we comfortable moving forward on that point?' Never assume it's handled just because you gave an answer." },
    { type: 'heading', text: "Step 6: Roll On and Close" },
    { type: 'paragraph', text: "Don't linger. Once the objection is handled and confirmed, transition immediately back to the close. Dwelling on a resolved objection brings it back to life." },
  ],

  "5-3": [
    { type: 'paragraph', text: "99.99% of sales reps fold when they hear these three denials. They say 'OK, better luck next time' and hang up. That's why they're not in the top 1%. Here's how you stay in the game." },
    { type: 'heading', text: "The 3 Common Denials" },
    { type: 'bullets', items: [
      { bold: "1. 'We're not interested.'", text: "" },
      { bold: "2. 'We're not in the market.'", text: "" },
      { bold: "3. 'It's not in the budget.'", text: "" },
    ]},
    { type: 'heading', text: "The Universal Rebuttal Script" },
    { type: 'callout', text: "This ONE script defeats all three denials. Memorize it word for word.", icon: "⚡" },
    { type: 'script', label: "The Rebuttal", lines: [
      { speaker: "Prospect", text: "We're not interested / not in the market / not in the budget." },
      { speaker: "You", text: "I can certainly understand that you're not [interested/in the market/in a position for that]. The purpose of my call is not to sell you anything, but to gain your professional opinion on our marketing development and automation solutions, so that when you ARE [interested/in the market/in a position], you will know what is available." },
      { speaker: "You", text: "Would Monday or Thursday be better for a product demonstration?" },
    ]},
    { type: 'paragraph', text: "This script keeps you in the game and bypasses the smokescreen. It lets you live to fight another day — or at least another 10 seconds to find a need, hook, angle, or pain point." },
  ],

  "5-4": [
    { type: 'heading', text: "Price Objection Mastery" },
    { type: 'paragraph', text: "Price objections come in many forms, but they all mean the same thing: the prospect doesn't yet see enough value to justify the investment. Your job is to build value, not cut price." },
    { type: 'heading', text: "'That's too expensive'" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "I can appreciate that. Expensive compared to what? What were you expecting to invest for a complete marketing automation solution?" },
    ]},
    { type: 'paragraph', text: "This reframes 'expensive' from absolute to relative. They have to compare it to something — and usually, they haven't thought about what the RIGHT price would be." },
    { type: 'heading', text: "'Your competitor is cheaper'" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "That's a fair point. Can I ask — what exactly are they offering at that price? Because in my experience, when the price is significantly lower, there's usually something missing. Let me show you exactly what's included in our solution so you can make an apples-to-apples comparison." },
    ]},
    { type: 'heading', text: "The Investment Reframe" },
    { type: 'paragraph', text: "Never call the price a 'cost.' Always call it an 'investment.' Costs are money gone. Investments are money that comes back multiplied." },
    { type: 'callout', text: "If the math shows $75,000/year in new revenue from a $3,588/year investment, the price isn't $299/month — it's a 20x return.", icon: "💰" },
  ],

  "5-5": [
    { type: 'heading', text: "Competitor Objection Scripts" },
    { type: 'paragraph', text: "When a prospect says they're already using a competitor, it's actually GOOD news. It means they have budget, they understand the need, and they've already bought into the category. Your job is to show them why Referrizer is the upgrade." },
    { type: 'heading', text: "'We already use Podium/Birdeye'" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "That's great — you clearly understand the importance of reputation management. How has your experience been? If you could change one thing about their platform, what would it be?" },
      { speaker: "You", text: "The reason I ask is that many of our clients switched from Podium specifically because they were paying $289+ per month for messaging, reviews, and web chat, but without loyalty programs, referral engines, or automated campaign tools. With Referrizer, you get all of that for $199/month, with AI-managed review responses included." },
    ]},
    { type: 'heading', text: "'We use GoHighLevel'" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "GoHighLevel is a powerful platform — but it requires significant technical setup. Most businesses need an agency to configure it. How much are you paying your agency on top of the GHL subscription? With Referrizer, everything works out of the box. No agency required. No technical barrier." },
    ]},
    { type: 'heading', text: "'We have someone doing our marketing'" },
    { type: 'script', label: "Script", lines: [
      { speaker: "You", text: "That's smart — you're clearly invested in growth. What I'd love to show you is how Referrizer can amplify what your marketing person is already doing. We're not replacing them — we're giving them superpowers. Can I show you in a 15-minute demo?" },
    ]},
  ],

  "5-6": [
    { type: 'heading', text: "Industry-Specific Objections" },
    { type: 'paragraph', text: "Every industry has its own flavor of objections. Here are the most common per vertical and exactly how to handle them." },
    { type: 'heading', text: "Fitness / Gyms" },
    { type: 'script', label: "'Our members don't want more texts'", lines: [
      { speaker: "You", text: "I hear that a lot. But here's what we've found: members don't mind texts that give them VALUE — like loyalty rewards, exclusive offers, or reminders about their progress. It's spam they hate, not relevant communication. Our platform ensures every message has a reason behind it." },
    ]},
    { type: 'heading', text: "Dental / Medical" },
    { type: 'script', label: "'We're concerned about HIPAA'", lines: [
      { speaker: "You", text: "Absolutely valid concern. Referrizer does not store or transmit PHI (Protected Health Information). Our SMS and review requests are marketing communications, not clinical data. We're used by hundreds of dental practices specifically because we've been built with these compliance considerations in mind." },
    ]},
    { type: 'heading', text: "Auto Repair" },
    { type: 'script', label: "'Our customers don't leave reviews'", lines: [
      { speaker: "You", text: "That's actually the #1 reason shops need Referrizer. Your customers don't leave reviews because nobody asks them at the right time, in the right way. Our system sends a review request 30 minutes after their service is complete — when satisfaction is highest. Shops that implement this see 10+ new Google reviews in the first 30 days." },
    ]},
    { type: 'heading', text: "Pet Care" },
    { type: 'script', label: "'Our clients already love us, we don't need marketing'", lines: [
      { speaker: "You", text: "That's actually the best position to be in. Your happy clients are your biggest untapped asset. A loyalty program that rewards frequent visits, automated review requests after every grooming or boarding stay, and a referral bonus for recommending you to fellow pet owners. These aren't marketing, they're an extension of the great experience you already provide. And they happen to generate 3-5 new regular clients per month." },
    ]},
  ],

  "5-7": [
    { type: 'heading', text: "Getting Past Gatekeepers" },
    { type: 'paragraph', text: "The gatekeeper — receptionist, office manager, or front desk staff — is the first line of defense. Their job is to protect the decision maker from salespeople. Your job is to get through without being combative." },
    { type: 'heading', text: "Gatekeeper Scripts" },
    { type: 'script', label: "The Confident Direct", lines: [
      { speaker: "You", text: "Hi, this is [Name] with Referrizer. Is [Owner/Manager name] available? I'm following up on some information they requested about their marketing." },
    ]},
    { type: 'paragraph', text: "Note: This only works if there's a reasonable basis for the claim. Don't lie — but if they've visited your website or been in your CRM, they technically 'requested' information by expressing interest." },
    { type: 'script', label: "The Peer-Level Approach", lines: [
      { speaker: "You", text: "Hi, I'm working with several [gyms/dental practices/auto shops] in [their area] on their Google review strategy. Could you let [Owner] know I called? My name is [Name] at Referrizer — they can reach me at [number]." },
    ]},
    { type: 'callout', text: "Never argue with gatekeepers. Never be rude. They talk to the decision maker. If you're an jerk to the receptionist, the owner will never take your call.", icon: "⚠️" },
    { type: 'heading', text: "Best Times to Bypass Gatekeepers" },
    { type: 'bullets', items: [
      { bold: "Before 8:30 AM", text: "Owners often answer their own phone before staff arrives." },
      { bold: "After 5:30 PM", text: "Same reason — front desk has left." },
      { bold: "Lunch Hour", text: "Gatekeepers take breaks too." },
    ]},
  ],

  // ===== DAY 5: OBJECTION MASTERY — THE COMPLETE ARSENAL =====

  // Phase 1: The Psychology & Classification of Objections
  "5-p1-read": [
    { type: 'heading', text: "Why Objections Happen — And Why They're Good" },
    { type: 'paragraph', text: "Most sales reps hear an objection and panic. Their heart rate spikes. They start talking faster. They immediately launch into a rebuttal. And they lose the deal. But here's what the data shows: objections are not rejection — they're engagement. Research from 67,149+ sales meetings shows that deals with MORE objections actually close at higher rates than deals with none. Why? Because serious buyers dig in. They ask tough questions. They push back. That's how they make decisions." },
    { type: 'callout', text: "Serious buyers pay attention. They get critical and ask tough questions. When prospects respond to your demo in a way that seems 'too good to be true,' it often is — and they won't end up buying. Objections are buying signals.", icon: "💡" },
    { type: 'heading', text: "What Top Performers Do Differently" },
    { type: 'bullets', items: [
      { bold: "They Pause", text: "Top performers pause for 1.5-2 seconds after an objection. Average performers pause for only 0.3 seconds. That 5x difference signals confidence and control." },
      { bold: "They Slow Down", text: "Average talking speed is 173 WPM. When flustered by an objection, bad reps speed up to 188 WPM. Top reps actually slow DOWN to 176 WPM — demonstrating they're in control." },
      { bold: "They Ask Questions", text: "Top performers respond to objections with a question 54.3% of the time vs. 31% for average performers. They clarify before they respond." },
      { bold: "They Avoid Monologues", text: "Average reps launch into a 'knee-jerk monologue' after an objection. Top reps keep the conversational flow — same speaker-switch cadence as the rest of the call." },
    ]},
    { type: 'heading', text: "The 5 Types of Objections" },
    { type: 'steps', steps: [
      { step: "1. Smokescreens", description: "Anything to get rid of you: 'No soliciting,' 'We're not interested,' 'The person you need is on vacation.' These are reflexive — not real objections. Treat ALL initial objections as smokescreens until you find out more. Remember: anger means cure! You WANT emotion — apathy gives you nothing to work with." },
      { step: "2. Obstacles", description: "Something the customer THINKS you can't overcome, but you CAN: 'We already have someone doing our SEO,' 'We just had our website redone,' 'We tried SMS programs before and it was a nightmare.' Your job: show them why this obstacle doesn't apply to your solution." },
      { step: "3. Serious Concerns", description: "Something that STOPS the selling process and must be addressed IMMEDIATELY: 'I met someone from your company before and they were like a used car salesman,' 'We used Referrizer in the past and didn't have the best experience.' Stop selling. Start listening. Fix this before anything else." },
      { step: "4. Questions", description: "A buying sign or request for more information: 'Do you build websites?' 'What is your international SMS rate?' Answer questions immediately or respond with a question of your own for clarification. ALWAYS think deeply about WHY the question is asked!" },
      { step: "5. Conditions", description: "Something that CANNOT be overcome: bankruptcy (hard condition), complete disqualification (soft condition). When you encounter a true condition, recognize it and move on. Don't waste your energy or theirs." },
    ]},
    { type: 'callout', text: "Sales = The Art of Asking Questions. If you think you're talking too much… you are.", icon: "🎯" },
  ],

  // Phase 2: The 6-Step Reflex — Verbatim Mastery
  "5-p2-read": [
    { type: 'heading', text: "The 6-Step Objection Handling Framework" },
    { type: 'paragraph', text: "This is the framework that separates professionals from amateurs. Every objection you will ever face can be handled with these six steps. Your goal: internalize this so deeply that it becomes a reflex — Unconscious Competence. You don't think about the steps. You just do them." },
    { type: 'steps', steps: [
      { step: "Step 1: HEAR THEM OUT", description: "Stay cool. Focus on what they're saying. Determine what the REAL issue is and if it's valid. Look for what they're NOT saying. Do NOT interrupt. Do NOT start formulating your response. Just listen. Research shows top reps pause 5x longer after hearing an objection. This alone builds more trust than any rebuttal." },
      { step: "Step 2: REPHRASE IT", description: "Rephrasing accomplishes 3 primary objectives: (1) Buys you time to think, (2) Clarifies the point so you address the right issue, (3) Lets the customer know you're listening. Example: 'So what you're saying is that having one company to handle reputation, SEO, campaigns, and website would be ideal, but you're not sure the investment makes sense right now?'" },
      { step: "Step 3: ISOLATE IT", description: "This is the most critical step most reps skip. Ask: 'Other than this, is there anything else preventing us from moving forward today?' If they voice other concerns, THOSE might be the real objections. If they say 'No, that's the only thing,' you've confirmed what you need to handle. A proven isolation question: 'If we figured out how to solve that completely, what other obstacles would we have to overcome?'" },
      { step: "Step 4: HANDLE IT", description: "NOW you address the objection. Not before. Only after you've listened, rephrased, and isolated. Use the appropriate technique: ROI reframe for price, ecosystem advantage for competitive, urgency math for timing, Universal Rebuttal for smokescreens. Your response should be concise — not a monologue." },
      { step: "Step 5: CONFIRM YOU HANDLED IT", description: "Don't assume silence means agreement. Ask directly: 'Does that address your concern?' or 'What concern do you feel is still left unaddressed?' The exact phrasing matters — don't say 'Does that make sense?' which can sound condescending. Objections buried alive never die — they come back as killer zombies later in the deal." },
      { step: "Step 6: ROLL ON AND CLOSE", description: "Once confirmed, don't linger. Move forward with confidence. Transition immediately to the next phase of the sale or the close itself. Lingering on a resolved objection reopens it." },
    ]},
    { type: 'callout', text: "CRITICAL: A strong answer to the WRONG objection makes the objection WORSE. That's why Steps 1-3 (Listen, Rephrase, Isolate) exist. Never skip them.", icon: "⚠️" },
    { type: 'heading', text: "The Validation Power Move" },
    { type: 'paragraph', text: "Before handling the objection (between Step 3 and 4), add a proven validation technique. Humans go through 95% of their lives feeling misunderstood. If YOU are the person who understands them, you carry powerful influence." },
    { type: 'script', label: "The Validation Script", lines: [
      { speaker: "You", text: "That's a valid concern, [Name]. It seems like you're [fill in the emotion: torn, frustrated, cautious, protective of your team's time]." },
    ]},
    { type: 'paragraph', text: "Then ask permission before responding: 'Can I bounce a few thoughts off of you?' NOT 'Can I make a suggestion?' — which triggers the 'rebellious teenager effect' and makes them defensive." },
  ],

  // Phase 3: Price & Budget Objections — Data-Driven Mastery
  "5-p3-read": [
    { type: 'heading', text: "Price Objections: The Most Misunderstood Objection" },
    { type: 'paragraph', text: "Here's the truth: most price objections aren't about price. They're about value. When a buyer says 'It's too expensive,' they're really saying 'I don't see the value.' That disconnect starts in discovery. If you haven't uncovered what's broken, what it's costing them, and why it's worth fixing NOW, the buyer has no reason to move forward — especially at full price." },
    { type: 'callout', text: "Price objections are completely avoidable if you know how to uncover the impact of the problem, what's causing it, and why the buyer needs to change. Price will always take a back seat when the buyer understands what's at risk. — Gap Selling", icon: "💰" },
    { type: 'heading', text: "Save Price for Last" },
    { type: 'paragraph', text: "Top performers bring up pricing at the 38-46 minute mark on a one-hour call. Average reps discuss it in the first 12-15 minutes. Why does waiting work? When you delay pricing, the customer gets impressed with the product first. If they're wowed, they'll have fewer pricing objections." },
    { type: 'heading', text: "Sandler Bracketing: Uncover Budget Without Confrontation" },
    { type: 'paragraph', text: "Instead of asking 'What's your budget?' (which leads to deflection), Bracketing gives the buyer an easy way to indicate a range:" },
    { type: 'script', label: "Bracketing in Action", lines: [
      { speaker: "You", text: "Our solutions range between $100 to $10,000 per month. What monthly budget are you looking to stay within so we only discuss solutions that fall within your budget range?" },
      { speaker: "Prospect", text: "A couple hundred dollars per month." },
      { speaker: "You", text: "Great, we have a lot of options available for you within that range." },
      { speaker: "Prospect", text: "You're my hero!" },
    ]},
    { type: 'paragraph', text: "Now you've established a baseline, and they've self-identified their budget comfortably. When you roleplay this with management, you'll get opportunities to handle multiple kinds of responses, not just the ideal one above. It is possible to become someone's hero, but more often you'll earn something even more durable: the position of a trusted advisor worthy to invest in a marketing solution with as a long-term partner." },
    { type: 'heading', text: "The 4 Price Rebuttal Scripts" },
    { type: 'steps', steps: [
      { step: "1. ROI Reframe", description: "'What's one new customer worth? $200? $500? If Referrizer brings you just ONE new customer per month — and our average client sees 15-20 — that single customer pays for the platform many times over. This isn't an expense; it's a revenue machine.'" },
      { step: "2. Reduce to the Ridiculous", description: "'$299/month ÷ 25 working days = $12/day. $12 ÷ 8 hours = $1.50/hour. You couldn't hire anyone for $1.50/hour to manage reputation, loyalty, campaigns, AND referrals.'" },
      { step: "3. Cost of Inaction", description: "'Every month without automated reviews, competitors add 15-20 reviews. Every month without a loyalty program, 15% of customers don't return. In 6 months, that's hundreds of lost customers and thousands in lost revenue. The real question isn't whether you can afford Referrizer — it's whether you can afford NOT to have it.'" },
      { step: "4. The Pause", description: "State the price and STOP TALKING. Research shows top reps pause TWICE as long as average reps after stating their price. Let the buyer think. If the value is clear, they'll come back with a real question or a decision. Don't rush to fill silence with a discount." },
    ]},
    { type: 'heading', text: "When to Hold Firm vs. Adjust" },
    { type: 'paragraph', text: "Most price objections don't warrant a discount. Lowering your price signals weakness, not value. If the value is clear and the business case is sound, lack of budget is a prioritization issue on their side — not a pricing issue on yours. The only time to adjust: when a competitor can deliver the same outcome with similar impact, speed, and confidence. Then make your differentiation visible." },
  ],

  // Phase 4: Competitive, Timing & Authority Objections
  "5-p4-read": [
    { type: 'heading', text: "Competitive Objections: 'We Already Use [Competitor]'" },
    { type: 'paragraph', text: "This is an Obstacle — they believe their current solution is sufficient. Your job isn't to bash the competitor. Your job is to expand their view of what's possible." },
    { type: 'heading', text: "Competitor-Specific Scripts" },
    { type: 'steps', steps: [
      { step: "'We use Podium/Birdeye'", description: "'I respect that — they're solid for reviews. Quick question: are they also handling your loyalty program, automated campaigns, referral system, AND lead capture through a Check-in Trigger? Usually the answer is no — they focus on ONE piece. You're paying $300-500/month for messaging and reviews. Referrizer includes all of that PLUS 5 more systems for less than Podium charges alone.'" },
      { step: "'We use GoHighLevel'", description: "'GHL is powerful — if you have a team of developers configuring it. How long did setup take? With Referrizer, everything works out of the box on day one. No code, no agency setup, no months of configuration. Your staff can manage it with 15 minutes of training.'" },
      { step: "'We already have a marketing agency'", description: "'Great that you're investing in marketing! Most agencies focus on ACQUIRING new customers through ads or SEO. Referrizer focuses on the OTHER side — making sure every customer who walks in COMES BACK, refers friends, and leaves reviews. We actually complement what your agency does. Would it make sense to see how they work together?'" },
    ]},
    { type: 'heading', text: "The Challenger Reframe Technique" },
    { type: 'paragraph', text: "Challengers don't 'handle' objections — they teach the customer why their objection is based on a flawed premise. Instead of arguing, reframe the entire conversation:" },
    { type: 'script', label: "The Reframe in Action", lines: [
      { speaker: "Prospect", text: "We're not ready to change right now. Maybe next quarter." },
      { speaker: "You", text: "I hear you on timing. But here's what I've seen: every month you wait, your competitors are collecting 15-20 new Google reviews. That's 45-60 more reviews by next quarter. The gap gets wider every single day. Right now isn't bad timing — it's actually the BEST timing, because you stop the bleeding immediately." },
    ]},
    { type: 'callout', text: "Reframe Questions: Is the objection a problem that can be reframed as an opportunity? A weakness reframed as a strength? Poor timing reframed as perfect timing?", icon: "🔄" },
    { type: 'heading', text: "Authority Objections: 'I Need to Talk to My Partner/Boss'" },
    { type: 'steps', steps: [
      { step: "Surface the Real Concern", description: "'I completely understand. What do you think their biggest question or concern would be?' Address it right now." },
      { step: "Offer a 3-Way Call", description: "'Would it be helpful if we did a quick 10-minute call together so they can hear the highlights directly?'" },
      { step: "Equip the Champion", description: "If they insist on presenting internally: 'Let me put together a one-pager with the ROI math specific to your business. That way you'll have the data to make the case.'" },
    ]},
  ],

  // Phase 5: Smokescreens, Gatekeepers & The 3 Common Denials
  "5-p5-read": [
    { type: 'heading', text: "The 3 Common Denials" },
    { type: 'paragraph', text: "These three phrases kill more deals than any real objection — because most reps give up when they hear them. Don't be most reps." },
    { type: 'steps', steps: [
      { step: "1. 'We're not interested.'", description: "This is the default human response to any cold outreach. It's a reflex, not a decision. They can't be 'not interested' in something they haven't seen." },
      { step: "2. 'We're not in the market.'", description: "Translation: 'We haven't felt enough pain to look for a solution yet.' Your job: create awareness of the gap between where they are and where they could be." },
      { step: "3. 'It's not in the budget.'", description: "Translation: 'I haven't seen enough value to justify the investment.' This is a value problem, not a money problem." },
    ]},
    { type: 'heading', text: "The Universal Rebuttal — One Script to Defeat All Three" },
    { type: 'script', label: "The Universal Rebuttal", lines: [
      { speaker: "You", text: "I can certainly understand that you're not [interested/in the market/budgeted for this]. The purpose of my call is NOT to sell you anything, but to gain your professional opinion on our marketing automation solutions, so that when you ARE [interested/in the market/budgeted], you'll know exactly what's available. Would Monday or Thursday be better for a 15-minute product tour?" },
    ]},
    { type: 'callout', text: "When 99.99% of every other sales rep folds and says 'OK, better luck next time,' this keeps you in the game. You bypass the smokescreen to live and fight another day — or at least another 10 seconds to find a hook.", icon: "🔥" },
    { type: 'heading', text: "Gatekeeper Psychology & Bypass Scripts" },
    { type: 'paragraph', text: "Gatekeepers (receptionists, office managers) have one job: protect the decision maker's time. They're trained to say 'no.' But they're not evaluating your product — they're filtering calls. Your goal: sound like you belong, not like a cold caller." },
    { type: 'steps', steps: [
      { step: "The Confident Direct", description: "'Hi, this is [Name] with Referrizer. Is [Owner name] available? I'm following up on some information about their Google reviews.' Note: only works if there's a reasonable basis — if they're in your CRM, they technically 'expressed interest.'" },
      { step: "The Peer-Level Approach", description: "'Hi, I'm working with several [gyms/dental practices] in [their area] on their review strategy. Could you let [Owner] know I called? My name is [Name] at Referrizer.' This positions you as an industry peer, not a salesperson." },
      { step: "Best Times to Call", description: "Before 8:30 AM (owner answers own phone), after 5:30 PM (front desk has left), or during lunch hour (gatekeepers take breaks too)." },
    ]},
    { type: 'callout', text: "NEVER argue with gatekeepers. NEVER be rude. They talk to the decision maker. If you're a jerk to the receptionist, the owner will NEVER take your call.", icon: "⚠️" },
  ],

  // Phase 6: Preventing Objections & Advanced Reframes
  "5-p6-read": [
    { type: 'heading', text: "The Sandler Philosophy: Prevention Over Handling" },
    { type: 'paragraph', text: "When a car crashes, you don't examine the crash itself. You go back to where the skidding started to determine what happened. Objections work the same way. When a prospect says 'Your price is too high,' the real problem isn't the price — it's that you didn't ask the right questions earlier to establish value." },
    { type: 'quote', text: "Instead of learning how to handle stalls and objections, learn how to avoid them in the first place by having a proven selling system to follow.", author: "Sandler Training" },
    { type: 'heading', text: "The 4 Discovery Questions That Prevent Objections" },
    { type: 'steps', steps: [
      { step: "1. What's broken?", description: "Identify the specific problem in their current state. Not 'How's your marketing?' but 'What's your biggest frustration with getting customers to come back?'" },
      { step: "2. Why is it happening?", description: "Root cause analysis. 'Is that because you don't have a system for it, or because the system you have isn't working?'" },
      { step: "3. How is it impacting the business?", description: "Quantify the pain. 'How many customers do you think you're losing each month? What's that worth in revenue?'" },
      { step: "4. What changes if it gets fixed?", description: "Paint the future state. 'If we could bring back even 10% of lost customers, what would that mean for your bottom line?'" },
    ]},
    { type: 'paragraph', text: "When these four elements are in place, your solution has weight. It's not a product — it's a fix. And the cost of the fix gets judged against the cost of staying put, not the buyer's original budget." },
    { type: 'heading', text: "The Reframe Technique" },
    { type: 'paragraph', text: "A reframe is an insight that changes how your customer thinks and feels about an objection, problem, or opportunity. It gets them to see things through a new lens." },
    { type: 'table', headers: ["Buyer's Frame", "Your Reframe"], rows: [
      ["'Bad timing — we're closing out the quarter'", "'The conversations your team is having right now are HIGHER stakes — this is the BEST time to optimize.'"],
      ["'It's too expensive'", "'Every month without it costs you $X in lost customers. The platform costs less than ONE lost customer.'"],
      ["'We already have a solution'", "'That's great for acquisition. But who's handling RETENTION? Studies show it costs 5-7x more to acquire than retain.'"],
      ["'I don't have time to implement'", "'That's exactly why we built it to work on autopilot. 15 minutes to set up, then it runs itself.'"],
    ]},
    { type: 'heading', text: "Advanced: Team Selling & The 258% Advantage" },
    { type: 'paragraph', text: "Research shows that having multiple participants from the seller's side on just ONE call in the sales cycle increases close rates by up to 258%. This is the most underused strategy in sales. Bring your manager, bring a product specialist, bring a success manager — the buyer sees a team invested in their success." },
    { type: 'bullets', items: [
      { bold: "Rule 1", text: "More than one seller participant, but not more than four (benefits drop off after four)." },
      { bold: "Rule 2", text: "Don't do team selling on a discovery call — it overwhelms. Do it on demos and closing calls." },
      { bold: "Rule 3", text: "Each seller has a defined role. No duplication. The prospect should feel like they're getting VIP treatment." },
    ]},
    { type: 'heading', text: "Never Ask 'Why?'" },
    { type: 'paragraph', text: "When handling objections, NEVER ask 'Why?' — it's a threatening question that challenges the validity of the buyer's concern and puts them on defense. Instead:" },
    { type: 'script', label: "Instead of 'Why?'", lines: [
      { speaker: "BAD", text: "'Why do you think it's too expensive?'" },
      { speaker: "GOOD", text: "'Can you help me understand what's causing that concern?'" },
    ]},
    { type: 'callout', text: "Confidence in Price: Buyers notice hesitation. If you show uncertainty when they question the price, you lose credibility. State the price and stop talking. Let the silence do the work.", icon: "💪" },
  ],
};
