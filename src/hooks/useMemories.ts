import { useEffect, useRef, useState, useCallback } from 'react';
import { INITIAL_MEMORIES, INITIAL_SETTINGS } from '../data/initialMemories';
import type { CoupleSettings, Memory } from '../types/memory';
import { getStorageItem, setStorageItem } from '../utils/storage';
import {
  fetchLaravelTimeline,
  createLaravelMemory,
  updateLaravelMemory,
  deleteLaravelMemory,
  clearAllLaravelMemories,
  updateLaravelSettings,
  resetLaravelTimeline,
  checkLaravelHealth,
} from '../services/laravelApi';
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
  const [isBackendConnected, setIsBackendConnected] = useState(false);

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

  // Function to pull latest data from Laravel backend
  const refreshFromBackend = useCallback(async () => {
    try {
      const result = await fetchLaravelTimeline();
      if (result.success && result.memories) {
        setIsBackendConnected(true);
        setMemories(result.memories);
        await setStorageItem(MEMORIES_STORAGE_KEY, result.memories);
        await setStorageItem(INITIALIZED_STORAGE_KEY, true);

        if (result.settings) {
          setSettings(prev => ({ ...prev, ...result.settings }));
          await setStorageItem(SETTINGS_STORAGE_KEY, result.settings);
        }
      } else {
        const isAlive = await checkLaravelHealth();
        setIsBackendConnected(isAlive);
      }
    } catch (err) {
      console.warn('Laravel backend sync error:', err);
      setIsBackendConnected(false);
    }
  }, []);

  // Hydration on mount: IndexedDB + Laravel Backend
  useEffect(() => {
    let isCancelled = false;

    async function hydrate() {
      try {
        // 1. Load locally from IndexedDB for instantaneous UI response
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

        // 2. Try fetching the authoritative state from Laravel Backend
        const laravelData = await fetchLaravelTimeline();
        if (!isCancelled && laravelData.success && laravelData.memories) {
          setIsBackendConnected(true);
          setMemories(laravelData.memories);
          await setStorageItem(MEMORIES_STORAGE_KEY, laravelData.memories);
          await setStorageItem(INITIALIZED_STORAGE_KEY, true);

          if (laravelData.settings) {
            setSettings(prev => ({ ...prev, ...laravelData.settings }));
            await setStorageItem(SETTINGS_STORAGE_KEY, laravelData.settings);
          }
        } else if (!isCancelled) {
          const alive = await checkLaravelHealth();
          setIsBackendConnected(alive);
        }
      } catch (err) {
        console.error('Failed to hydrate memories:', err);
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

  // Optional: Firebase Cloud Real-time Subscription (if user configured Firebase)
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

  // Save memories and settings locally & backup whenever changed
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

  const addMemory = async (memoryData: Omit<Memory, 'id' | 'createdAt' | 'milestoneNumber'>) => {
    const newMemory: Memory = {
      ...memoryData,
      id: 'mem-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now(),
      milestoneNumber: memories.length + 1,
    };

    setMemories(prev => [...prev, newMemory]);

    // Send to Laravel Backend
    createLaravelMemory(newMemory).then(res => {
      if (res.success) {
        setIsBackendConnected(true);
      }
    }).catch(err => {
      console.warn('Could not save memory to Laravel backend:', err);
    });

    return newMemory;
  };

  const updateMemory = async (updated: Memory) => {
    setMemories(prev => prev.map(item => (item.id === updated.id ? updated : item)));

    // Send to Laravel Backend
    updateLaravelMemory(updated).then(res => {
      if (res.success) {
        setIsBackendConnected(true);
      }
    }).catch(err => {
      console.warn('Could not update memory in Laravel backend:', err);
    });
  };

  const deleteMemory = async (id: string) => {
    setMemories(prev => prev.filter(item => item.id !== id));

    // Send to Laravel Backend
    deleteLaravelMemory(id).then(res => {
      if (res.success) {
        setIsBackendConnected(true);
      }
    }).catch(err => {
      console.warn('Could not delete memory in Laravel backend:', err);
    });
  };

  const clearAllMemories = async () => {
    setMemories([]);

    // Send to Laravel Backend
    clearAllLaravelMemories().then(res => {
      if (res.success) {
        setIsBackendConnected(true);
      }
    }).catch(err => {
      console.warn('Could not clear memories in Laravel backend:', err);
    });
  };

  const updateSettings = async (newSettings: Partial<CoupleSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));

    // Send to Laravel Backend
    updateLaravelSettings(newSettings).then(res => {
      if (res.success) {
        setIsBackendConnected(true);
      }
    }).catch(err => {
      console.warn('Could not update settings in Laravel backend:', err);
    });
  };

  const resetToDefaults = async () => {
    setMemories(INITIAL_MEMORIES);
    setSettings(INITIAL_SETTINGS);
    await setStorageItem(MEMORIES_STORAGE_KEY, INITIAL_MEMORIES);
    await setStorageItem(SETTINGS_STORAGE_KEY, INITIAL_SETTINGS);
    await setStorageItem(INITIALIZED_STORAGE_KEY, true);

    // Reset Laravel Backend
    resetLaravelTimeline().then(res => {
      if (res.success) {
        setIsBackendConnected(true);
      }
    }).catch(err => {
      console.warn('Could not reset Laravel backend:', err);
    });

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
    isBackendConnected,
    refreshFromBackend,
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
