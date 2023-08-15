import { type NextApiRequest, type NextApiResponse } from "next";
import { type ErrorResponse } from "~/types/types";
import { generateCode } from "~/utils/helper";
import { prismaClient } from "./prisma-client";

export async function createLink(
  req: NextApiRequest,
  res: NextApiResponse<CreateLinkResponse | ErrorResponse>
) {
  try {
    const { url } = req.body as CreateLinkRequest;
    if (!url) {
      return res.status(400).json({ error: "Url is required" });
    }

    // Maintain database to have only 10 entries
    const maxEntries = 10;
    const totalEntries = await prismaClient.urlLinks.count();

    // Delete earliest entries if needed
    if (totalEntries >= maxEntries) {
      const entriesToDelete = totalEntries - maxEntries + 1; // Calculate how many entries to delete
      const earliestEntries = await prismaClient.urlLinks.findMany({
        orderBy: {
          createdAt: "asc", // Order by createdAt in ascending order (earliest first)
        },
        take: entriesToDelete, // Limit the number of entries to delete
      });

      // Delete the earliest entries
      for (const entry of earliestEntries) {
        await prismaClient.urlLinks.delete({
          where: {
            id: entry.id,
          },
        });
      }
    }

    // Generate code for new url
    let code;
    const maxAttempt = 5;
    let numAttempt = 0;
    while (true) {
      code = generateCode();

      const existingLink = await prismaClient.urlLinks.findFirst({
        where: {
          code: code,
        },
      });

      if (!existingLink) {
        break;
      }

      numAttempt += 1;
      if (numAttempt >= maxAttempt) {
        res.status(500).json({ error: `Failed to generate a code.` });
        return;
      }
    }

    // save to database
    const newLink = await prismaClient.urlLinks.create({
      data: {
        url,
        code,
      },
    });

    res.status(200).json({
      url: newLink.url,
      createdAt: newLink.createdAt,
      code: newLink.code,
    });
  } catch (error) {
    console.error("Error in creating linking API:", error);
    res.status(500).json({ error: `Error in creating linking API.` });
  }
}

export interface CreateLinkRequest {
  url: string;
}

export interface CreateLinkResponse {
  url: string;
  createdAt: Date;
  code: number;
}
