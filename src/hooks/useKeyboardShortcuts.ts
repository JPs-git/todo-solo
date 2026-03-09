import { useEffect, useCallback } from 'react';

export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  description: string;
  group: string;
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: ShortcutConfig[];
  enabled?: boolean;
  ignoreInputs?: boolean;
}

export const useKeyboardShortcuts = (options: UseKeyboardShortcutsOptions) => {
  const { shortcuts, enabled = true, ignoreInputs = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      if (ignoreInputs) {
        const target = event.target as HTMLElement;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target.isContentEditable
        ) {
          if (event.key !== 'Escape') return;
        }
      }

      for (const shortcut of shortcuts) {
        const isCtrl = shortcut.ctrl ? event.ctrlKey || event.metaKey : true;
        const isShift = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const isAlt = shortcut.alt ? event.altKey : !event.altKey;
        const isKey = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (isCtrl && isShift && isAlt && isKey) {
          event.preventDefault();
          shortcut.handler();
          break;
        }
      }
    },
    [shortcuts, enabled, ignoreInputs]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts: shortcuts.map(s => ({
      keys: [
        ...(s.ctrl ? ['Ctrl'] : []),
        ...(s.shift ? ['Shift'] : []),
        ...(s.alt ? ['Alt'] : []),
        s.key === ' ' ? 'Space' : s.key,
      ],
      description: s.description,
      group: s.group,
    })),
  };
};
