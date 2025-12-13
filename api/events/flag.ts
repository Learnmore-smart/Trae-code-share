import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FLAG_THRESHOLD = 3; // Disable after 3 flags

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // Increment flag count and check if should be disabled
    const eventLink = await prisma.eventLink.update({
      where: { id },
      data: {
        flagCount: {
          increment: 1
        }
      }
    });

    // If flag count reaches threshold, disable the link
    if (eventLink.flagCount >= FLAG_THRESHOLD && !eventLink.isDisabled) {
      await prisma.eventLink.update({
        where: { id },
        data: { isDisabled: true }
      });
    }

    return res.status(200).json({ 
      flagCount: eventLink.flagCount,
      isDisabled: eventLink.flagCount >= FLAG_THRESHOLD
    });
  } catch (error) {
    if (String(error).includes('Record to update not found')) {
      return res.status(404).json({ message: 'Event link not found' });
    }
    console.error('Error flagging event:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
