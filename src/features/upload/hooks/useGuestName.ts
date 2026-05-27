import { useCallback, useState } from 'react';
import { getItem, removeItem, setItem } from '@services/storage';
import { STORAGE_KEYS } from '@features/events/types';

interface UseGuestNameResult {
  readonly name: string | null;
  readonly setName: (name: string) => void;
  readonly clearName: () => void;
}

/**
 * The guest's name persists across uploads (they only type it once).
 * Each guest's name is local to their own browser.
 */
export function useGuestName(): UseGuestNameResult {
  const [name, setNameState] = useState<string | null>(() => getItem<string>(STORAGE_KEYS.GUEST_NAME));

  const setName = useCallback((value: string): void => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setItem(STORAGE_KEYS.GUEST_NAME, trimmed);
    setNameState(trimmed);
  }, []);

  const clearName = useCallback((): void => {
    removeItem(STORAGE_KEYS.GUEST_NAME);
    setNameState(null);
  }, []);

  return { name, setName, clearName };
}
