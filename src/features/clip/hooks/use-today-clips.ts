import { useCallback, useEffect, useState } from 'react';

import { listClipsForDay } from '@/features/clip/clip-repository';
import type { LocalClip } from '@/features/clip/types';
import { getLocalDayKey } from '@/features/day/local-day';

export function useTodayClips() {
  const [clips, setClips] = useState<LocalClip[]>([]);
  const [loading, setLoading] = useState(true);
  const dayKey = getLocalDayKey();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await listClipsForDay(dayKey);
      setClips(next);
    } finally {
      setLoading(false);
    }
  }, [dayKey]);

  useEffect(() => {
    let cancelled = false;
    listClipsForDay(dayKey)
      .then((next) => {
        if (!cancelled) setClips(next);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dayKey]);

  return { clips, loading, dayKey, refresh };
}
