import { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // Strict validation for Trae URLs
    try {
      const parsedUrl = new URL(url);
      if (!parsedUrl.hostname.endsWith("trae.com.cn")) {
        return res
          .status(400)
          .json({ message: "Only trae.com.cn links are allowed" });
      }
      // Check if it matches the specific event format slightly looser to account for variations,
      // but strict on the domain.
      // The user mentioned: https://www.trae.com.cn/events/s/JvxJPUN6xGI/
      if (!parsedUrl.pathname.includes("/events/")) {
        return res
          .status(400)
          .json({ message: "Invalid Trae event URL format" });
      }
    } catch (e) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    const eventLink = await prisma.eventLink.create({
      data: {
        originalUrl: url,
      },
    });

    return res.status(201).json(eventLink);
  } catch (error) {
    console.error("Error creating event link:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
