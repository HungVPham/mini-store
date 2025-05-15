import { useEffect, useRef, useCallback } from "react";
import useDebounce from "./useDebounce";

export default function useInfiniteScroll(
  callback: (...args: any[]) => void,
  {
    root = null,
    rootMargin = "100px",
    threshold = 1,
    once = false,
    debounceDelay = 300,
  } = {}
) {
  const observerRef = useRef(null);
  const triggeredOnceRef = useRef(false);
  const debouncedCallback = useDebounce(callback, debounceDelay);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && (!once || !triggeredOnceRef.current)) {
        debouncedCallback();
        if (once) {
          triggeredOnceRef.current = true;
        }
      }
    },
    [debouncedCallback, once]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      threshold,
    });

    const elt = observerRef.current;
    if (elt) {
      observer.observe(elt);
    }

    return () => {
      if (elt) {
        observer.unobserve(elt);
        observer.disconnect();
      }
    };
  }, [handleIntersect, root, rootMargin, threshold]);

  return observerRef;
}
