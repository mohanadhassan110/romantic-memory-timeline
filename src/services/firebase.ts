import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, type Firestore } from 'firebase/firestore';
import type { CoupleSettings, Memory } from '../types/memory';

export type { FirebaseOptions };

const FIREBASE_CONFIG_KEY = 'moments_of_us_firebase_config_v1';
const TIMELINE_DOC_ID = 'romantic_story_main';
const COLLECTION_NAME = 'timelines';

// Default / Environment config
export function getStoredFirebaseConfig(): FirebaseOptions | null {
  // 1. Check if user configured via dashboard UI
  try {
    const local = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed?.apiKey && parsed?.projectId) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // 2. Check Vite environment variables (e.g. Vercel deployment)
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    };
  }

  return null;
}

export function saveFirebaseConfig(config: FirebaseOptions): void {
  localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
}

export function clearFirebaseConfig(): void {
  localStorage.removeItem(FIREBASE_CONFIG_KEY);
}

export function isFirebaseConfigured(): boolean {
  return getStoredFirebaseConfig() !== null;
}

let cachedApp: FirebaseApp | null = null;
let cachedDb: Firestore | null = null;

export function getFirestoreDB(): Firestore | null {
  const config = getStoredFirebaseConfig();
  if (!config) return null;

  try {
    if (!cachedApp) {
      cachedApp = getApps().length > 0 ? getApp() : initializeApp(config);
    }
    if (!cachedDb && cachedApp) {
      cachedDb = getFirestore(cachedApp);
    }
    return cachedDb;
  } catch (err) {
    console.error('[Firebase] Failed to initialize Firestore:', err);
    return null;
  }
}

// Subscribe to real-time updates from Firestore
export function subscribeToCloudTimeline(
  onUpdate: (data: { memories: Memory[]; settings?: CoupleSettings }) => void,
  onError?: (err: any) => void
): () => void {
  const db = getFirestoreDB();
  if (!db) {
    return () => {};
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, TIMELINE_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && Array.isArray(data.memories)) {
            onUpdate({
              memories: data.memories,
              settings: data.settings,
            });
          }
        }
      },
      (error) => {
        console.warn('[Firebase] Snapshot error:', error);
        onError?.(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('[Firebase] Error setting up listener:', err);
    return () => {};
  }
}

// Save timeline to cloud Firestore
export async function saveTimelineToCloud(
  memories: Memory[],
  settings: CoupleSettings
): Promise<{ success: boolean; error?: string }> {
  const db = getFirestoreDB();
  if (!db) {
    return { success: false, error: 'Firebase is not configured' };
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, TIMELINE_DOC_ID);
    await setDoc(docRef, {
      memories,
      settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return { success: true };
  } catch (err: any) {
    console.error('[Firebase] Failed to save to Firestore:', err);
    return { success: false, error: err?.message || 'Error saving to cloud' };
  }
}
