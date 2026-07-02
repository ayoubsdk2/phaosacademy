import type { CompanyBrand } from '@/data/academyData';
import { BRAND_CONFIG } from '@/data/academyData';
import { READING_CONTENT, type ContentBlock } from '@/data/readingContent';

const brandHighlight: Record<CompanyBrand, string> = {
  referrizer: 'bg-brand-referrizer/10 text-brand-referrizer',
  wrh: 'bg-brand-wrh/10 text-brand-wrh',
  tc: 'bg-brand-tc/10 text-brand-tc',
  group: 'bg-primary/10 text-primary',
};

const brandBullet: Record<CompanyBrand, string> = {
  referrizer: 'bg-brand-referrizer',
  wrh: 'bg-brand-wrh',
  tc: 'bg-brand-tc',
  group: 'bg-primary',
};

const brandBorder: Record<CompanyBrand, string> = {
  referrizer: 'border-brand-referrizer/30',
  wrh: 'border-brand-wrh/30',
  tc: 'border-brand-tc/30',
  group: 'border-primary/30',
};

function RenderBlock({ block, brand, index }: { block: ContentBlock; brand: CompanyBrand; index: number }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-muted-foreground leading-relaxed">{block.text}</p>;

    case 'heading':
      return <h3 className="text-lg font-bold text-foreground mt-6 mb-2">{block.text}</h3>;

    case 'quote':
      return (
        <blockquote className={`border-l-4 ${brandBorder[brand]} pl-4 py-2 my-4 bg-secondary/30 rounded-r-xl`}>
          <p className="text-foreground font-medium italic">"{block.text}"</p>
          {block.author && <p className="text-muted-foreground text-sm mt-1">— {block.author}</p>}
        </blockquote>
      );

    case 'callout':
      return (
        <div className={`p-4 rounded-xl border ${brandBorder[brand]} ${brandHighlight[brand]} bg-opacity-50 my-4`}>
          <p className="text-sm font-medium">
            {block.icon && <span className="mr-2">{block.icon}</span>}
            {block.text}
          </p>
        </div>
      );

    case 'bullets':
      return (
        <ul className="space-y-3 my-4">
          {block.items?.map((item, i) => (
            <li key={i} className="flex gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
              <div className={`w-5 h-5 rounded-full ${brandBullet[brand]} text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5`}>
                {i + 1}
              </div>
              <div>
                <span className="font-bold text-foreground">{item.bold}</span>
                {item.text && <span className="text-muted-foreground"> — {item.text}</span>}
              </div>
            </li>
          ))}
        </ul>
      );

    case 'examples':
      return (
        <div className="my-4 p-4 bg-secondary/30 rounded-xl border border-border">
          {block.heading && <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{block.heading}</p>}
          <ul className="space-y-2">
            {block.examples?.map((ex, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className={`shrink-0 font-bold ${brandHighlight[brand].split(' ')[1]}`}>•</span>
                <span className="italic">"{ex}"</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'steps':
      return (
        <div className="space-y-3 my-4">
          {block.steps?.map((s, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-secondary border border-border">
              <div className={`w-8 h-8 rounded-lg ${brandBullet[brand]} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
                {i + 1}
              </div>
              <div>
                <p className="font-bold text-foreground">{s.step}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case 'script':
      return (
        <div className="my-4 bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
          {block.label && (
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{block.label}</p>
            </div>
          )}
          <div className="p-4 space-y-3">
            {block.lines?.map((line, i) => (
              <div key={i} className="flex gap-3">
                {line.speaker && (
                  <span className={`text-xs font-bold uppercase tracking-wide shrink-0 w-16 pt-0.5 ${line.speaker === 'You' ? 'text-brand-referrizer' : 'text-amber-400'}`}>
                    {line.speaker}
                  </span>
                )}
                <p className="text-slate-200 text-sm leading-relaxed">"{line.text}"</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'table':
      return (
        <div className="my-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            {block.headers && (
              <thead>
                <tr className="bg-secondary">
                  {block.headers.map((h, i) => (
                    <th key={i} className="px-4 py-2 text-left font-bold text-foreground text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows?.map((row, i) => (
                <tr key={i} className="border-t border-border hover:bg-secondary/30 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2.5 text-muted-foreground">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

export function ReadingModule({ title, brand = 'group', moduleId }: { title: string; brand?: CompanyBrand; moduleId?: string }) {
  const content = moduleId ? READING_CONTENT[moduleId] : null;

  return (
    <div className="card-surface p-8 sm:p-10">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {brand !== 'group' && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${brandHighlight[brand]}`}>
            {BRAND_CONFIG[brand].name}
          </span>
        )}
      </div>

      {content ? (
        <div className="space-y-3">
          {content.map((block, i) => (
            <RenderBlock key={i} block={block} brand={brand} index={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>Content for this module is being prepared.</p>
        </div>
      )}
    </div>
  );
}
