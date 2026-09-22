import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTimelineData, saveTimelineData } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const data = await getTimelineData();
      return res.status(200).json({
        success: true,
        memories: data.memories,
        settings: data.settings,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { memories, settings } = req.body || {};
      const current = await getTimelineData();
      const updated = {
        memories: Array.isArray(memories) ? memories : current.memories,
        settings: settings ? { ...current.settings, ...settings } : current.settings,
      };
      await saveTimelineData(updated);
      return res.status(200).json({
        success: true,
        memories: updated.memories,
        settings: updated.settings,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
