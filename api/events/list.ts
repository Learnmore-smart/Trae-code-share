import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const events = await prisma.eventLink.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      select: {
        id: true,
        viewCount: true,
        createdAt: true,
        originalUrl: true // We might want to mask this in a real app, but for now show it so they know what they are clicking
      }
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error('Error listing events:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
