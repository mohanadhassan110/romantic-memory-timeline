import { useEffect, useState } from 'react';
import { INITIAL_MEMORIES, INITIAL_SETTINGS } from '../data/initialMemories';
import type { CoupleSettings, Memory } from '../types/memory';

const MEMORIES_STORAGE_KEY = 'moments_of_us_memories_ar_v2';
const SETTINGS_STORAGE_KEY = 'moments_of_us_settings_ar_v2';

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const stored = localStorage.getItem(MEMORIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load memories from localStorage', e);
    }
    return INITIAL_MEMORIES;
  });

  const [settings, setSettings] = useState<CoupleSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
    return INITIAL_SETTINGS;
  });

  // Save on change
  useEffect(() => {
    try {
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(memories));
    } catch (e) {
      console.error('Failed to save memories to localStorage', e);
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  // Sort memories chronologically (oldest to newest for story timeline)
  const sortedMemories = [...memories].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const addMemory = (memoryData: Omit<Memory, 'id' | 'createdAt' | 'milestoneNumber'>) => {
    const newMemory: Memory = {
      ...memoryData,
      id: 'mem-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now(),
      milestoneNumber: memories.length + 1,
    };
    setMemories(prev => [...prev, newMemory]);
    return newMemory;
  };

  const updateMemory = (updated: Memory) => {
    setMemories(prev => prev.map(item => (item.id === updated.id ? updated : item)));
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(item => item.id !== id));
  };

  const updateSettings = (newSettings: Partial<CoupleSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = () => {
    setMemories(INITIAL_MEMORIES);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem(MEMORIES_STORAGE_KEY);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  };

  const exportData = () => {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      memories,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moments-of-us-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.memories)) {
        setMemories(parsed.memories);
        if (parsed.settings) {
          setSettings(prev => ({ ...prev, ...parsed.settings }));
        }
        return { success: true, message: `Successfully restored ${parsed.memories.length} memories!` };
      }
      return { success: false, message: 'Invalid file format: missing memories array.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Error parsing JSON file' };
    }
  };

  return {
    memories: sortedMemories,
    settings,
    addMemory,
    updateMemory,
    deleteMemory,
    updateSettings,
    resetToDefaults,
    exportData,
    importData,
  };
}
