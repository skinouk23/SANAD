import { useEffect, useState } from 'react';

export function useDelayedPending(isPending: boolean, delayMs = 200): boolean {
  const [isDelayedPending, setIsDelayedPending] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setIsDelayedPending(false);
      return;
    }

    if (delayMs <= 0) {
      setIsDelayedPending(true);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsDelayedPending(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, isPending]);

  return isDelayedPending;
}
