import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Invalid code parameter' });
    }

    if (req.method === 'GET') {
      const invitationCode = await prisma.invitationCode.findUnique({
        where: { code }
      });

      if (!invitationCode) {
        return res.status(404).json({ message: 'Invitation code not found' });
      }

      return res.status(200).json(invitationCode);
    } else if (req.method === 'PUT') {
      // Mark code as used
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const invitationCode = await prisma.invitationCode.update({
        where: { code },
        data: {
          status: 'USED',
          usedBy: userId,
          usedAt: new Date(),
          updatedAt: new Date()
        }
      });

      return res.status(200).json(invitationCode);
    } else if (req.method === 'PATCH') {
      // Update code metadata (e.g., mark as copied)
      const invitationCode = await prisma.invitationCode.findUnique({
        where: { code }
      });

      if (!invitationCode) {
        return res.status(404).json({ message: 'Invitation code not found' });
      }

      const currentMetadata = invitationCode.metadata as any || {};
      const updatedInvitationCode = await prisma.invitationCode.update({
        where: { code },
        data: {
          metadata: {
            ...currentMetadata,
            isCopied: true,
            copyCount: (currentMetadata.copyCount || 0) + 1,
            lastCopiedAt: new Date()
          },
          updatedAt: new Date()
        }
      });

      return res.status(200).json(updatedInvitationCode);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};