// Robust IndexedDB storage utility with zero dependencies

const DB_NAME = 'moments_of_us_db';
const DB_VERSION = 1;
const STORE_NAME = 'app_store';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

export async function getStorageItem<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise<T | null>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result !== undefined ? (request.result as T) : null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.warn(`[storage] Error reading ${key} from IndexedDB:`, error);
    // Fallback to localStorage
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }
}

export async function setStorageItem<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn(`[storage] Error writing ${key} to IndexedDB:`, error);
  }

  // Also attempt to sync with localStorage if small enough
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Expected to fail if size exceeds 5MB, which is safe because IndexedDB already stored it
  }
}

export async function removeStorageItem(key: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn(`[storage] Error deleting ${key} from IndexedDB:`, error);
  }

  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}
