import { cn } from '@/lib/utils';

interface MarqueeItem {
  id: number;
  name: string;
  description?: string | null;
}

interface InfiniteMarqueeProps {
  items: MarqueeItem[];
  className?: string;
  speed?: number;
}

export default function InfiniteMarquee({ items, className, speed = 30 }: InfiniteMarqueeProps) {
  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        'overflow-hidden',
        className,
      )}
    >
      <div
        className="flex w-max gap-10 whitespace-nowrap"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item.id}-${i}`}
            className="text-sm font-medium text-white/80 tracking-wide flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="font-semibold text-white">{item.name}</span>
            {item.description && (
              <span className="text-white/50">· {item.description}</span>
            )}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
