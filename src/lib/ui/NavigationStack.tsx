import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

// ── Easing curves (match iOS spring feel) ───────────────────────────────────
const PUSH_EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const POP_EASE  = 'cubic-bezier(0.40, 0.00, 0.60, 1.00)';
const SNAP_EASE = 'cubic-bezier(0.34, 1.20, 0.64, 1.00)'; // slight overshoot

// ── Context ──────────────────────────────────────────────────────────────────

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

// ── Helpers ──────────────────────────────────────────────────────────────────

function tx(el: HTMLElement | null, x: number, transition = 'none') {
  if (!el) return;
  el.style.transition = transition;
  el.style.transform = `translate3d(${x}px,0,0)`;
}

// ── NavigationStack ──────────────────────────────────────────────────────────

export function NavigationStack({ initialPage }: { initialPage: ReactNode }) {
  const winW = window.innerWidth;

  const [stack, setStack] = useState<StackEntry[]>([
    { id: 'root', page: initialPage },
  ]);

  // Stable ref map: entry id → DOM element
  const elMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Mutable refs so pointer handlers always see fresh values without re-registering
  const stackRef    = useRef(stack);
  const canGoBackRef = useRef(false);
  stackRef.current   = stack;
  canGoBackRef.current = stack.length > 1;

  const getEl  = (id: string) => elMap.current.get(id) ?? null;
  const currId = () => stackRef.current[stackRef.current.length - 1].id;
  const prevId = () => stackRef.current.length > 1
    ? stackRef.current[stackRef.current.length - 2].id
    : null;

  // ── Stack mutations ────────────────────────────────────────────────────────

  const removeTop = useCallback(() => {
    setStack(p => (p.length > 1 ? p.slice(0, -1) : p));
  }, []);

  const pop = useCallback(() => {
    const cId = currId(), pId = prevId();
    const curr = getEl(cId), prev = pId ? getEl(pId) : null;
    const overlay = overlayRef.current;

    tx(curr,    winW,          `transform 0.28s ${POP_EASE}`);
    tx(prev,    0,             `transform 0.28s ${POP_EASE}`);
    if (overlay) { overlay.style.transition = `opacity 0.28s ${POP_EASE}`; overlay.style.opacity = '0'; }

    setTimeout(removeTop, 280);
  }, [winW, removeTop]);

  const push = useCallback((page: ReactNode) => {
    setStack(p => [...p, { id: crypto.randomUUID(), page }]);
  }, []);

  // ── Push animation ─────────────────────────────────────────────────────────
  // useLayoutEffect fires before paint — lets us set the initial off-screen
  // position before the new page becomes visible, then kick off the CSS transition.

  const prevLen = useRef(stack.length);
  useLayoutEffect(() => {
    const newLen = stack.length;
    if (newLen <= prevLen.current) { prevLen.current = newLen; return; }
    prevLen.current = newLen;

    const cId = currId(), pId = prevId();
    const curr = getEl(cId), prev = pId ? getEl(pId) : null;
    const overlay = overlayRef.current;

    // Place new page off-screen right before paint
    tx(curr, winW);
    curr?.getBoundingClientRect(); // force reflow so 'none' takes effect

    // Animate in
    tx(curr,    0,              `transform 0.32s ${PUSH_EASE}`);
    tx(prev,    -winW * 0.3,   `transform 0.32s ${PUSH_EASE}`);
    if (overlay) {
      overlay.style.transition = 'none';
      overlay.style.opacity = '0';
      overlay.getBoundingClientRect();
      overlay.style.transition = `opacity 0.32s ${PUSH_EASE}`;
      overlay.style.opacity = '0.25';
    }
  }, [stack.length, winW]);

  // ── Drag gesture — pure pointer events, zero rAF ─────────────────────────

  const drag = useRef({ active: false, startX: 0, startTime: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = Math.max(0, e.clientX - drag.current.startX);
      const cId = currId(), pId = prevId();

      tx(getEl(cId), dx);
      tx(pId ? getEl(pId) : null, -winW * 0.3 + dx * 0.3);
      if (overlayRef.current)
        overlayRef.current.style.opacity = String(0.25 * Math.max(0, 1 - dx / winW));
    };

    const onUp = (e: PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.active = false;

      const dx = Math.max(0, e.clientX - drag.current.startX);
      const dt = Math.max(Date.now() - drag.current.startTime, 1);
      const vel = dx / dt; // px/ms

      const cId = currId(), pId = prevId();
      const curr = getEl(cId), prev = pId ? getEl(pId) : null;
      const overlay = overlayRef.current;

      if (dx > winW * 0.35 || vel > 0.4) {
        // Complete the pop
        tx(curr, winW, `transform 0.22s ${POP_EASE}`);
        tx(prev, 0,    `transform 0.22s ${POP_EASE}`);
        if (overlay) { overlay.style.transition = `opacity 0.22s ${POP_EASE}`; overlay.style.opacity = '0'; }
        setTimeout(removeTop, 220);
      } else {
        // Snap back
        tx(curr, 0,            `transform 0.3s ${SNAP_EASE}`);
        tx(prev, -winW * 0.3,  `transform 0.3s ${SNAP_EASE}`);
        if (overlay) { overlay.style.transition = `opacity 0.3s ${SNAP_EASE}`; overlay.style.opacity = '0.25'; }
      }
    };

    window.addEventListener('pointermove',  onMove, { passive: true });
    window.addEventListener('pointerup',    onUp,   { passive: true });
    window.addEventListener('pointercancel', onUp,  { passive: true });
    return () => {
      window.removeEventListener('pointermove',  onMove);
      window.removeEventListener('pointerup',    onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [winW, removeTop]); // stable — reads stack via refs

  const onPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    if (!canGoBackRef.current) return;
    if (id !== currId()) return;
    if (e.clientX > 44) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { active: true, startX: e.clientX, startTime: Date.now() };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  const canGoBack = stack.length > 1;

  return (
    <NavigationContext.Provider value={{ push, pop, canGoBack }}>
      <div className="h-dvh overflow-hidden relative bg-[var(--color-paper)]">
        {stack.map((entry, i) => {
          const isCurrent = i === stack.length - 1;
          const isPrev    = i === stack.length - 2;
          const hidden    = !isCurrent && !isPrev;

          return (
            <div
              key={entry.id}
              ref={el => {
                if (el) elMap.current.set(entry.id, el);
                else    elMap.current.delete(entry.id);
              }}
              onPointerDown={isCurrent ? e => onPointerDown(e, entry.id) : undefined}
              className="absolute inset-0 will-change-transform"
              style={{
                visibility: hidden ? 'hidden' : 'visible',
                transform: isCurrent ? 'translate3d(0,0,0)' : `translate3d(${-winW * 0.3}px,0,0)`,
                zIndex: i,
              }}
            >
              {entry.page}

              {/* Dim overlay on previous page */}
              {isPrev && (
                <div
                  ref={overlayRef}
                  className="absolute inset-0 bg-black pointer-events-none"
                  style={{ opacity: 0.25 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </NavigationContext.Provider>
  );
}
