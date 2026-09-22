import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveTimelineData, DEFAULT_MEMORIES, DEFAULT_SETTINGS } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const resetData = {
        memories: DEFAULT_MEMORIES,
        settings: DEFAULT_SETTINGS,
      };
      await saveTimelineData(resetData);
      return res.status(200).json({
        success: true,
        memories: resetData.memories,
        settings: resetData.settings,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
