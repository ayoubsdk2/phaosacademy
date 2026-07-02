import { useState } from 'react';
import type { CompanyBrand } from '@/data/academyData';
import { FLIPCARD_CONTENT } from '@/data/flipcardContent';

const brandFlipBg: Record<CompanyBrand, string> = {
  referrizer: 'bg-brand-referrizer',
  wrh: 'bg-brand-wrh',
  tc: 'bg-brand-tc',
  group: 'bg-primary',
};

export function FlipCards({ brand = 'group', moduleId }: { brand?: CompanyBrand; moduleId?: string }) {
  const cards = (moduleId && FLIPCARD_CONTENT[moduleId]) || FLIPCARD_CONTENT['1-8'] || [];
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setFlipped(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          onClick={() => toggle(i)}
          className="h-48 perspective-1000 cursor-pointer group"
        >
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped.has(i) ? 'rotate-y-180' : ''}`}>
            <div className="absolute inset-0 card-surface flex items-center justify-center font-bold text-lg text-foreground backface-hidden rounded-2xl p-4 text-center">
              {card.front}
              <span className="absolute bottom-3 text-[10px] text-muted-foreground font-normal">Click to flip</span>
            </div>
            <div className={`absolute inset-0 ${brandFlipBg[brand]} text-white rounded-2xl flex items-center justify-center p-5 text-center text-sm font-medium rotate-y-180 backface-hidden leading-relaxed`}>
              {card.back}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
