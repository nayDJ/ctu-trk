'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'framer-motion';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_MAGNIFICATION = 64;
const DEFAULT_DISTANCE = 120;
const DEFAULT_PANEL_WIDTH = 56;
const BASE_SIZE = 40;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelWidth?: number;
  magnification?: number;
  spring?: SpringOptions;
  justify?: 'start' | 'center';
};

type DockContextType = {
  mouseY: MotionValue<number>;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};

type ItemContextType = {
  size: MotionValue<number>;
  isHovered: MotionValue<number>;
};

const DockContext = createContext<DockContextType | undefined>(undefined);
const ItemContext = createContext<ItemContextType | undefined>(undefined);

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within a VerticalDock');
  }
  return context;
}

function useDockItem() {
  return useContext(ItemContext);
}

function VerticalDock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelWidth = DEFAULT_PANEL_WIDTH,
  justify = 'center',
}: DockProps) {
  const mouseY = useMotionValue(Infinity);

  const value = useMemo(
    () => ({ mouseY, spring, magnification, distance }),
    [mouseY, spring, magnification, distance],
  );

  return (
    <div
      className={cn('flex h-full w-full justify-center', className)}
      onMouseMove={(e) => mouseY.set(e.clientY)}
      onMouseLeave={() => mouseY.set(Infinity)}
    >
      <div
        className={cn('flex h-full w-full flex-col items-center gap-1', justify === 'start' ? 'justify-start' : 'justify-center')}
        style={{ width: panelWidth }}
        role="toolbar"
        aria-label="Sidebar navigation"
      >
        <DockContext.Provider value={value}>{children}</DockContext.Provider>
      </div>
    </div>
  );
}

function VerticalDockItem({ children, className }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { distance, magnification, mouseY, spring } = useDock();

  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseY, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - domRect.y - domRect.height / 2;
  });

  const sizeTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [BASE_SIZE, magnification, BASE_SIZE],
  );

  const size = useSpring(sizeTransform, spring);

  const itemValue = useMemo(() => ({ size, isHovered }), [size, isHovered]);

  return (
    <motion.div
      ref={ref}
      style={{ height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={cn(
        'relative inline-flex w-full items-center justify-center overflow-visible',
        className,
      )}
    >
      <ItemContext.Provider value={itemValue}>{children}</ItemContext.Provider>
    </motion.div>
  );
}

function VerticalDockLabel({ children, className }: { className?: string; children: React.ReactNode }) {
  const item = useDockItem();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!item) return;
    const unsubscribe = item.isHovered.on('change', (latest: number) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [item]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 whitespace-nowrap rounded-lg border border-primary bg-primary-dark px-3 py-1.5 text-xs font-medium text-white shadow-lg pointer-events-none',
            className,
          )}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function VerticalDockIcon({ children, className }: { className?: string; children: React.ReactNode }) {
  const item = useDockItem();
  const fallbackSize = useMotionValue(BASE_SIZE);

  const iconSize = useTransform(
    item?.size ?? fallbackSize,
    (val: number) => Math.round(val * 0.55),
  );

  return (
    <motion.div
      style={{ height: iconSize, width: iconSize }}
      className={cn('flex items-center justify-center', className)}
    >
      {children}
    </motion.div>
  );
}

export { VerticalDock, VerticalDockItem, VerticalDockLabel, VerticalDockIcon };
