import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    // Update view count and fetch URL in one transaction if possible,
    // or just update then retrieve.
    const eventLink = await prisma.eventLink.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        },
        lastViewedAt: new Date()
      }
    });

    if (!eventLink) {
      return res.status(404).json({ message: 'Link not found' });
    }

    return res.status(200).json({ originalUrl: eventLink.originalUrl });
  } catch (error) {
    // If RecordNotFound
    if (String(error).includes('Record to update not found')) {
         return res.status(404).json({ message: 'Link not found' });
    }
    console.error('Error fetching event link:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
