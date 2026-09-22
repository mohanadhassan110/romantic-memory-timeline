import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTimelineData, saveTimelineData, type Memory } from './_db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const data = await getTimelineData();

    if (req.method === 'POST') {
      const memory: Memory = req.body;
      if (!memory || !memory.title) {
        return res.status(400).json({ success: false, error: 'Invalid memory data' });
      }

      // Check if memory with this id already exists, or append
      const existingIndex = data.memories.findIndex(m => m.id === memory.id);
      if (existingIndex >= 0) {
        data.memories[existingIndex] = memory;
      } else {
        data.memories.push(memory);
      }

      await saveTimelineData(data);
      return res.status(200).json({ success: true, memory });
    }

    if (req.method === 'PUT') {
      const memory: Memory = req.body;
      const id = (req.query.id as string) || memory?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing memory ID' });
      }

      data.memories = data.memories.map(m => (m.id === id ? { ...m, ...memory } : m));
      await saveTimelineData(data);
      return res.status(200).json({ success: true, memory });
    }

    if (req.method === 'DELETE') {
      const id = (req.query.id as string) || (req.body && req.body.id);
      if (id) {
        data.memories = data.memories.filter(m => m.id !== id);
      } else {
        // Clear all memories
        data.memories = [];
      }

      await saveTimelineData(data);
      return res.status(200).json({ success: true, memories: data.memories });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
}
