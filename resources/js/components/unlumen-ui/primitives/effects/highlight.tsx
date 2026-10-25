'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type HighlightMode = 'parent' | 'children';

type HighlightProps = {
  children: React.ReactNode;
  className?: string;
  mode?: HighlightMode;
  hover?: boolean;
  controlledItems?: boolean;
  style?: React.CSSProperties;
  containerClassName?: string;
};

type HighlightItemProps = {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  active?: boolean;
};

const HighlightContext = React.createContext<{
  activeRef: React.RefObject<HTMLElement | null>;
  register: (el: HTMLElement | null) => void;
} | null>(null);

function Highlight({
  children,
  className,
  hover = false,
  style,
  containerClassName,
}: HighlightProps) {
  const activeRef = React.useRef<HTMLElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [highlightStyle, setHighlightStyle] = React.useState<React.CSSProperties>({});

  const register = React.useCallback((el: HTMLElement | null) => {
    activeRef.current = el;
    if (el) {
      const rect = el.getBoundingClientRect();
      const parentRect = el.closest('[data-highlight-container]')?.getBoundingClientRect();
      if (parentRect) {
        setHighlightStyle({
          position: 'absolute',
          top: rect.top - parentRect.top,
          left: rect.left - parentRect.left,
          width: rect.width,
          height: rect.height,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        });
      }
    }
  }, []);

  const handleContainerMouseLeave = React.useCallback(() => {
    const activeEl = containerRef.current?.querySelector<HTMLElement>('[data-highlight-active]');
    if (activeEl) {
      register(activeEl);
    }
  }, [register]);

  const contextValue = React.useMemo(() => ({ activeRef, register }), [register]);

  return (
    <HighlightContext.Provider value={contextValue}>
      <div
        data-highlight-container
        ref={containerRef}
        onMouseLeave={handleContainerMouseLeave}
        className={cn('relative', containerClassName)}
        style={style}
      >
        <div
          className={cn('pointer-events-none absolute transition-all duration-200', className)}
          style={highlightStyle}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </HighlightContext.Provider>
  );
}

function HighlightItem({ children, className, asChild, active }: HighlightItemProps) {
  const context = React.useContext(HighlightContext);
  const ref = React.useRef<HTMLElement | null>(null);

  const setRef = React.useCallback(
    (node: HTMLElement | null) => {
      ref.current = node;
      if (node) {
        if (active) {
          node.setAttribute('data-highlight-active', 'true');
          context?.register(node);
        } else {
          node.removeAttribute('data-highlight-active');
        }
      }
    },
    [active, context],
  );

  const handleMouseEnter = React.useCallback(() => {
    if (ref.current) {
      context?.register(ref.current);
    }
  }, [context]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: setRef,
      className: cn((children as any).props.className, className),
      onMouseEnter: handleMouseEnter,
    });
  }

  return (
    <div ref={setRef as any} className={className} onMouseEnter={handleMouseEnter}>
      {children}
    </div>
  );
}

export { Highlight, HighlightItem };
