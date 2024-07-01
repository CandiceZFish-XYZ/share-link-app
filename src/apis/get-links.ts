import { type NextApiRequest, type NextApiResponse } from "next";
import { type UrlLink, type ErrorResponse } from "~/types/types";
import { getAuth } from "@clerk/nextjs/server";

import { desc, eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { urlLinks } from "~/drizzle/schema";

export interface GetLinksResponse {
  links: UrlLink[];
}

export async function getLinks(
  req: NextApiRequest,
  res: NextApiResponse<GetLinksResponse | ErrorResponse>
) {
  const { userId } = getAuth(req);
  if (!userId) {
    console.error("User not authenticated in get-links API.");
    res.status(401).json({ error: "User not authenticated" });
    return;
  }
  try {
    // Fetch top 5 entries sorted by 'desc'
    const response = (await db
      .select()
      .from(urlLinks)
      .where(eq(urlLinks.userId, userId))
      .orderBy(desc(urlLinks.createdAt))
      .limit(5)) as UrlLink[];

    // const response = await db.query.urlLinks.findMany({
    //   limit: 5,
    //   with: {
    //     userId: userId,
    //   },
    //   orderBy: [desc(urlLinks.createdAt)],
    // });

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
