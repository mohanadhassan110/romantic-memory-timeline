import type { CoupleSettings, Memory } from '../types/memory';

const LARAVEL_API_KEY = 'moments_of_us_laravel_api_url_v1';
const DEFAULT_LARAVEL_URL = 'http://localhost:8000/api';

export function getLaravelApiUrl(): string {
  try {
    const saved = localStorage.getItem(LARAVEL_API_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // ignore
  }

  return (import.meta.env.VITE_LARAVEL_API_URL as string) || DEFAULT_LARAVEL_URL;
}

export function saveLaravelApiUrl(url: string): void {
  localStorage.setItem(LARAVEL_API_KEY, url.trim());
}

export function resetLaravelApiUrl(): void {
  localStorage.removeItem(LARAVEL_API_KEY);
}

// Check backend health
export async function checkLaravelHealth(): Promise<boolean> {
  const baseUrl = getLaravelApiUrl();
  try {
    const res = await fetch(`${baseUrl}/timeline`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Fetch all memories & settings from Laravel
export async function fetchLaravelTimeline(): Promise<{
  success: boolean;
  memories?: Memory[];
  settings?: CoupleSettings;
  error?: string;
}> {
  const baseUrl = getLaravelApiUrl();
  try {
    const res = await fetch(`${baseUrl}/timeline`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      success: true,
      memories: data.memories,
      settings: data.settings,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'تعذر الاتصال بخادم Laravel',
    };
  }
}

// Create a new memory in Laravel
export async function createLaravelMemory(
  memory: Omit<Memory, 'createdAt'>
): Promise<{ success: boolean; memory?: Memory; error?: string }> {
  const baseUrl = getLaravelApiUrl();
  try {
    const res = await fetch(`${baseUrl}/memories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(memory),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return { success: true, memory: data.memory };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// Update existing memory in Laravel
export async function updateLaravelMemory(
  memory: Memory
): Promise<{ success: boolean; memory?: Memory; error?: string }> {
  const baseUrl = getLaravelApiUrl();
  try {
    const res = await fetch(`${baseUrl}/memories/${memory.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(memory),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return { success: true, memory: data.memory };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// Delete memory in Laravel
export async function deleteLaravelMemory(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const baseUrl = getLaravelApiUrl();
  try {
    const res = await fetch(`${baseUrl}/memories/${id}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    return { success: res.ok };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// Clear all memories in Laravel
export async function clearAllLaravelMemories(): Promise<{ success: boolean; error?: string }> {
  const baseUrl = getLaravelApiUrl();
  try {
    const res = await fetch(`${baseUrl}/memories`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    return { success: res.ok };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// Update settings in Laravel
export async function updateLaravelSettings(
  settings: Partial<CoupleSettings>
): Promise<{ success: boolean; settings?: CoupleSettings; error?: string }> {
  const baseUrl = getLaravelApiUrl();
  try {
    const res = await fetch(`${baseUrl}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return { success: true, settings: data.settings };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// Reset timeline in Laravel
export async function resetLaravelTimeline(): Promise<{
  success: boolean;
  memories?: Memory[];
  settings?: CoupleSettings;
}> {
  const baseUrl = getLaravelApiUrl();
  try {
    const res = await fetch(`${baseUrl}/reset`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });

    const data = await res.json();
    return {
      success: res.ok,
      memories: data.memories,
      settings: data.settings,
    };
  } catch {
    return { success: false };
  }
}
