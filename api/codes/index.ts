import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate a random 8-character invitation code
const generateCode = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Get all invitation codes
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const codes = await prisma.invitationCode.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      return res.status(200).json(codes);
    } else if (req.method === 'POST') {
      const { count = 1 } = req.body;
      const codes = [];

      for (let i = 0; i < count; i++) {
        const code = generateCode();
        const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/use/${code}`;

        const invitationCode = await prisma.invitationCode.create({
          data: {
            code,
            shareUrl,
            status: 'UNUSED',
            metadata: {
              isCopied: false,
              copyCount: 0
            }
          }
        });

        codes.push(invitationCode);
      }

      return res.status(201).json(codes);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};