import gsap from 'gsap';

type ActiveViewTransition = {
  finished: Promise<unknown>;
};

type DocumentWithViewTransition = Document & {
  activeViewTransition?: ActiveViewTransition;
};

export function playAfterPageTransition(
  animation: gsap.core.Animation,
  delay = 0,
) {
  let cancelled = false;
  let delayedCall: gsap.core.Tween | undefined;

  animation.pause(0);

  const play = () => {
    if (cancelled) return;

    delayedCall = gsap.delayedCall(delay, () => {
      if (!cancelled) {
        animation.play();
      }
    });
  };

  const transition = (document as DocumentWithViewTransition)
    .activeViewTransition;

  if (transition) {
    transition.finished.catch(() => undefined).finally(play);
  } else {
    play();
  }

  return () => {
    cancelled = true;
    delayedCall?.kill();
  };
}
