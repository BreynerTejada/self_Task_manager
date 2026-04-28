import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}

export function useGlobalShortcuts() {
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);
  const openSearch = useUIStore((s) => s.openSearch);
  const closeQuickAdd = useUIStore((s) => s.closeQuickAdd);
  const closeSearch = useUIStore((s) => s.closeSearch);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') {
        closeQuickAdd();
        closeSearch();
        return;
      }
      if (isTypingTarget(e.target)) return;
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openQuickAdd();
      } else if (e.key === '/') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openQuickAdd, openSearch, closeQuickAdd, closeSearch]);
}
