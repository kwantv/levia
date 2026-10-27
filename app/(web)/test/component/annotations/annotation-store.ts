// scene/annotation-store.ts
import { create } from 'zustand';
import gsap from 'gsap';

type Anim = () => gsap.core.Animation | void;
type Entry = {
  root: React.RefObject<HTMLElement | null>;
  enter?: Anim;
  exit?: Anim;
};

const entries = new Map<string, Entry>();
let running: gsap.core.Animation | null = null;

function run(prev: string | null, id: string | undefined, delay: number) {
  running?.kill();
  const tl = (running = gsap.timeline());

  const out = prev ? entries.get(prev) : undefined;
  if (out?.root.current) {
    const el = out.root.current;
    tl.add(out.exit?.() ?? gsap.to(el, { autoAlpha: 0, duration: 0.2 }));
    tl.set(el, { autoAlpha: 0 });
  }

  const into = id ? entries.get(id) : undefined;
  if (into?.root.current) {
    const el = into.root.current;
    tl.set(el, { autoAlpha: 1 }, `+=${delay}`);
    tl.add(
      into.enter?.() ?? gsap.from(el, { autoAlpha: 0, y: 8, duration: 0.4 }),
    );
  }
}

type State = {
  active: string | null;
  register: (id: string, entry: Entry) => () => void;
  show: (id: string | undefined, delay?: number) => void;
};

export const useAnnotationStore = create<State>((set, get) => ({
  active: null,

  register: (id, entry) => {
    entries.set(id, entry);
    // show() was called before we mounted (refresh mid-page): catch up now
    if (get().active === id) run(null, id, 0);
    return () => void entries.delete(id);
  },

  show: (id, delay = 0) => {
    const prev = get().active;
    if (id === prev) return;
    set({ active: id }); // recorded even if nothing is mounted yet
    run(prev, id, delay);
  },
}));
