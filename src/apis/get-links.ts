import { type NextApiRequest, type NextApiResponse } from "next";
import { type UrlLink, type ErrorResponse } from "~/types/types";
import { prismaClient } from "./prisma-client";

export interface GetLinksResponse {
  links: UrlLink[];
}

export async function getLinks(
  req: NextApiRequest,
  res: NextApiResponse<GetLinksResponse | ErrorResponse>
) {
  try {
    // Fetch top 5 entries sorted by 'desc'
    const response = await prismaClient.urlLinks.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (response.length > 0) {
      res.status(200).json({ links: response });
    } else {
      res.status(404).json({ error: "No data." });
    }
  } catch (error) {
    console.error("Error in GET links API:", error);
    res.status(500).json({ error: `Error in GET links API.` });
  }
}
