import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTimelineData, saveTimelineData, type Memory } from '../_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const memoryId = Array.isArray(id) ? id[0] : id;

  if (!memoryId) {
    return res.status(400).json({ success: false, error: 'Memory ID is required' });
  }

  try {
    const data = await getTimelineData();

    if (req.method === 'PUT') {
      const memory: Partial<Memory> = req.body || {};
      let updated: Memory | undefined;

      data.memories = data.memories.map(m => {
        if (m.id === memoryId) {
          updated = { ...m, ...memory, id: memoryId };
          return updated;
        }
        return m;
      });

      await saveTimelineData(data);
      return res.status(200).json({ success: true, memory: updated });
    }

    if (req.method === 'DELETE') {
      data.memories = data.memories.filter(m => m.id !== memoryId);
      await saveTimelineData(data);
      return res.status(200).json({ success: true, message: 'Memory deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
}
