import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  useDragControls,
} from 'framer-motion';
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

// ── Context ─────────────────────────────────────────────────────────────────

interface NavigationContextValue {
  push: (page: ReactNode) => void;
  pop: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within <NavigationStack>');
  return ctx;
}

// ── Stack entry ──────────────────────────────────────────────────────────────

interface StackEntry {
  id: string;
  page: ReactNode;
}

// ── NavigationStack ──────────────────────────────────────────────────────────

interface NavigationStackProps {
  initialPage: ReactNode;
}

export function NavigationStack({ initialPage }: NavigationStackProps) {
  const winWidth = window.innerWidth;

  const [stack, setStack] = useState<StackEntry[]>([
    { id: 'root', page: initialPage },
  ]);

  // Shared motion value for the current page's x position.
  // Previous page derives its x from this via useTransform (parallax).
  const x = useMotionValue(0);

  // Previous page parallax: when current is fully right (popped), prev is at 0.
  // When current is idle (x=0), prev is hidden 30% off-screen left.
  const prevX = useTransform(x, [0, winWidth], [-winWidth * 0.3, 0]);

  // Dim overlay on prev page — fades as you swipe back, full when covered
  const overlayOpacity = useTransform(x, [0, winWidth], [0.25, 0]);

  const dragControls = useDragControls();
  const pendingPush = useRef(false);

  // ── Stack mutations ──────────────────────────────────────────────────────

  const removeTop = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const pop = useCallback(async () => {
    // Animate current page out to the right
    await animate(x, winWidth, { type: 'tween', ease: 'easeIn', duration: 0.26 });
    removeTop();
    x.set(0);
  }, [x, winWidth, removeTop]);

  const push = useCallback(
    (page: ReactNode) => {
      pendingPush.current = true;
      setStack((prev) => [...prev, { id: crypto.randomUUID(), page }]);
    },
    [],
  );

  // ── Push animation ───────────────────────────────────────────────────────
  // useLayoutEffect fires synchronously after DOM update but before paint,
  // so we can set x to winWidth before the new page is visible, then animate in.

  const prevStackLen = useRef(stack.length);
  useLayoutEffect(() => {
    if (pendingPush.current && stack.length > prevStackLen.current) {
      x.set(winWidth); // place new page off-screen right before paint
      pendingPush.current = false;
      animate(x, 0, {
        type: 'tween',
        ease: [0.25, 0.46, 0.45, 0.94] as unknown as 'easeOut',
        duration: 0.32,
      });
    }
    prevStackLen.current = stack.length;
  }, [stack.length, x, winWidth]);

  // ── Drag to go back ──────────────────────────────────────────────────────

  const handleDragEnd = useCallback(
    async (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const shouldPop = info.offset.x > 80 || info.velocity.x > 400;
      if (shouldPop) {
        await animate(x, winWidth, { type: 'tween', ease: 'easeOut', duration: 0.22 });
        removeTop();
        x.set(0);
      } else {
        // Snappy iOS spring — high stiffness, critically damped
      animate(x, 0, { type: 'spring', stiffness: 700, damping: 50, restDelta: 0.5 });
      }
    },
    [x, winWidth, removeTop],
  );

  const canGoBack = stack.length > 1;
  const current = stack[stack.length - 1];
  const previous = stack.length > 1 ? stack[stack.length - 2] : null;

  return (
    <NavigationContext.Provider value={{ push, pop, canGoBack }}>
      <div className="h-dvh overflow-hidden relative bg-[var(--color-paper)]">

        {/* Previous page — parallax behind current */}
        {previous && (
          <motion.div
            style={{ x: prevX }}
            className="absolute inset-0 will-change-transform"
          >
            {previous.page}
            {/* Dim overlay — darkens when covered by current page */}
            <motion.div
              className="absolute inset-0 bg-black pointer-events-none"
              style={{ opacity: overlayOpacity }}
            />
          </motion.div>
        )}

        {/* Current page — draggable from left edge */}
        <motion.div
          key={current.id}
          drag={canGoBack ? 'x' : false}
          dragControls={dragControls}
          dragListener={false}          /* only start via controls.start() */
          dragConstraints={{ left: 0, right: winWidth }}
          dragElastic={0}              /* exact finger tracking */
          style={{ x }}
          onDragEnd={handleDragEnd}
          onPointerDown={(e) => {
            // Only activate from within 44px of left edge (iOS convention)
            if (canGoBack && e.clientX < 44) {
              dragControls.start(e);
            }
          }}
          className="absolute inset-0 will-change-transform"
        >
          {/* Left-edge shadow — depth cue as you pull */}
          <motion.div
            className="absolute inset-y-0 left-0 w-8 pointer-events-none z-10"
            style={{
              background: useTransform(
                x,
                [0, winWidth],
                ['rgba(0,0,0,0)', 'rgba(0,0,0,0)'],
              ),
              boxShadow: useTransform(
                x,
                [0, 20],
                ['none', 'inset 6px 0 12px rgba(0,0,0,0.18)'],
              ),
            }}
          />
          {current.page}
        </motion.div>

      </div>
    </NavigationContext.Provider>
  );
}
