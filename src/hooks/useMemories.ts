import { useEffect, useRef, useState } from 'react';
import { INITIAL_MEMORIES, INITIAL_SETTINGS } from '../data/initialMemories';
import type { CoupleSettings, Memory } from '../types/memory';
import { getStorageItem, setStorageItem } from '../utils/storage';
import {
  isFirebaseConfigured,
  subscribeToCloudTimeline,
  saveTimelineToCloud,
} from '../services/firebase';

const MEMORIES_STORAGE_KEY = 'moments_of_us_memories_ar_v2';
const SETTINGS_STORAGE_KEY = 'moments_of_us_settings_ar_v2';
const INITIALIZED_STORAGE_KEY = 'moments_of_us_initialized_v2';

export function useMemories() {
  const [isHydrated, setIsHydrated] = useState(false);
  const isHydratedRef = useRef(false);
  const [cloudStatus, setCloudStatus] = useState<
    'connected' | 'syncing' | 'unconfigured' | 'error'
  >(() => (isFirebaseConfigured() ? 'connected' : 'unconfigured'));

  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const isInit = localStorage.getItem(INITIALIZED_STORAGE_KEY);
      const stored = localStorage.getItem(MEMORIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 || isInit === 'true') {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load memories synchronously from localStorage', e);
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

  // Asynchronous hydration from IndexedDB on mount
  useEffect(() => {
    let isCancelled = false;

    async function hydrate() {
      try {
        const [isInit, dbMemories, dbSettings] = await Promise.all([
          getStorageItem<boolean | string>(INITIALIZED_STORAGE_KEY),
          getStorageItem<Memory[]>(MEMORIES_STORAGE_KEY),
          getStorageItem<CoupleSettings>(SETTINGS_STORAGE_KEY),
        ]);

        if (isCancelled) return;

        if (isInit === true || isInit === 'true') {
          if (Array.isArray(dbMemories)) {
            setMemories(dbMemories);
          }
        } else {
          const localStored = localStorage.getItem(MEMORIES_STORAGE_KEY);
          if (localStored) {
            try {
              const parsed = JSON.parse(localStored);
              if (Array.isArray(parsed)) {
                setMemories(parsed);
                await setStorageItem(MEMORIES_STORAGE_KEY, parsed);
              }
            } catch {}
          } else {
            await setStorageItem(MEMORIES_STORAGE_KEY, INITIAL_MEMORIES);
          }
          await setStorageItem(INITIALIZED_STORAGE_KEY, true);
        }

        if (dbSettings) {
          setSettings(prev => ({ ...prev, ...dbSettings }));
        }
      } catch (err) {
        console.error('Failed to hydrate memories from IndexedDB:', err);
      } finally {
        if (!isCancelled) {
          isHydratedRef.current = true;
          setIsHydrated(true);
        }
      }
    }

    hydrate();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Firebase Cloud Real-time Subscription (Cross-device sync!)
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return;
    }

    const unsubscribe = subscribeToCloudTimeline(
      ({ memories: cloudMemories, settings: cloudSettings }) => {
        if (Array.isArray(cloudMemories)) {
          setMemories(cloudMemories);
          setStorageItem(MEMORIES_STORAGE_KEY, cloudMemories);
          setStorageItem(INITIALIZED_STORAGE_KEY, true);
        }
        if (cloudSettings) {
          setSettings(prev => ({ ...prev, ...cloudSettings }));
          setStorageItem(SETTINGS_STORAGE_KEY, cloudSettings);
        }
        setCloudStatus('connected');
      },
      () => {
        setCloudStatus('error');
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Save memories and settings locally & cloud whenever changed
  useEffect(() => {
    if (!isHydratedRef.current) return;

    setStorageItem(MEMORIES_STORAGE_KEY, memories);
    setStorageItem(SETTINGS_STORAGE_KEY, settings);
    setStorageItem(INITIALIZED_STORAGE_KEY, true);

    // Sync to cloud if Firebase is configured
    if (isFirebaseConfigured()) {
      saveTimelineToCloud(memories, settings).then((res) => {
        setCloudStatus(res.success ? 'connected' : 'error');
      });
    }
  }, [memories, settings]);

  // Manual trigger to sync current memories to cloud
  const syncToCloudNow = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'لم يتم ربط مشروع Firebase بعد.' };
    }
    setCloudStatus('syncing');
    const res = await saveTimelineToCloud(memories, settings);
    setCloudStatus(res.success ? 'connected' : 'error');
    return res;
  };

  // Sort memories chronologically
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

  const clearAllMemories = () => {
    setMemories([]);
  };

  const updateSettings = (newSettings: Partial<CoupleSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = async () => {
    setMemories(INITIAL_MEMORIES);
    setSettings(INITIAL_SETTINGS);
    await setStorageItem(MEMORIES_STORAGE_KEY, INITIAL_MEMORIES);
    await setStorageItem(SETTINGS_STORAGE_KEY, INITIAL_SETTINGS);
    await setStorageItem(INITIALIZED_STORAGE_KEY, true);

    if (isFirebaseConfigured()) {
      await saveTimelineToCloud(INITIAL_MEMORIES, INITIAL_SETTINGS);
    }
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
        return { success: true, message: `تمت استعادة ${parsed.memories.length} ذكريات بنجاح!` };
      }
      return { success: false, message: 'صيغة الملف غير صالحة: مصفوفة الذكريات غير موجودة.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'خطأ أثناء استيراد الملف' };
    }
  };

  return {
    memories: sortedMemories,
    settings,
    isHydrated,
    cloudStatus,
    syncToCloudNow,
    addMemory,
    updateMemory,
    deleteMemory,
    clearAllMemories,
    updateSettings,
    resetToDefaults,
    exportData,
    importData,
  };
}
