import { useEffect, useRef } from "react";

export default function useDebounce(cbFn: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null> (null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedFn = (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      cbFn(...args);
    }, delay);
  };

  return debouncedFn;
}
