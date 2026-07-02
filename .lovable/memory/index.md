# Memory: index.md
Updated: now

Multi-brand LMS for Referrizer Group (Referrizer, We Rank Higher, True Conversions)

## Brand Colors (HSL)
- Referrizer: Blue 217 91% 60%
- We Rank Higher: Green 142 71% 42%
- True Conversions: Orange 24 95% 53%
- Sidebar shifts gradient based on active day's brand

## Executive Voices
- Visionary (CEO Andre Cvijovic): Day 1, 5, 10
- Closer (VP Sales Daniel Lindros): Day 2, 7, 9
- Strategist (COO/CTO): Day 3, 4, 6, 8

## Architecture
- Multi-brand tokens in index.css (--brand-referrizer, --brand-wrh, --brand-tc)
- CompanyBrand type: 'referrizer' | 'wrh' | 'tc' | 'group'
- Each Day and Module has a `brand` field
- Sidebar background gradient changes per active brand

## Game: ReferRisers! Rise To The Top!
- Replaced old "Tower of Absolute Retention" gothic game
- Heavenly theme: sky blues, whites, gold accents, parallax clouds
- 100 questions, 10 levels of 10, 10 lives (😇), 10s timer
- 24hr lockout on all lives lost (localStorage)
- Andre's face (andre.webp) used for animations
- Level-up: Andre ascends tower + Andre-ism quote
- Life lost: Andre falls → angel catches → smile + "SAVED!"
- Web Audio API: chimes, falling whistle, hallelujah, bg music scales with level
- Components in src/components/academy/modules/referrisers/
- Hook: src/hooks/useReferRisers.ts

## Pending
- ElevenLabs integration for real voice synthesis
- Real AI chatbot via Lovable AI Gateway
