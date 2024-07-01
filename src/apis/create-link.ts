import { type NextApiRequest, type NextApiResponse } from "next";
import { type ErrorResponse } from "~/types/types";
import { generateCode } from "~/utils/helper";
import { getAuth } from "@clerk/nextjs/server";
import { count, asc, eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { urlLinks } from "~/drizzle/schema";

export async function createLink(
  req: NextApiRequest,
  res: NextApiResponse<CreateLinkResponse | ErrorResponse>
) {
  const { userId } = getAuth(req);
  if (!userId) {
    console.error("UserId not found in create-link API.");
    res.status(500).json({ error: `UserId not found in create-link API.` });
  }

  try {
    const { url } = req.body as CreateLinkRequest;
    if (!url) {
      res.status(400).json({ error: "Url is required" });
      return;
    }

    // Maintain database to have only 10 entries
    const maxEntries = 10;
    await maintainDB(maxEntries);

    // Generate code for new url
    const code = await getValidCode();
    if (code === 500) {
      res.status(500).json({ error: `Failed to generate a code.` });
      return;
    }

    // Insert entry into database
    const newLinkArr = await db
      .insert(urlLinks)
      .values({
        url,
        code,
        userId: userId!,
      })
      .returning();

    // check returned entry of insertion
    if (newLinkArr.length < 1) {
      res.status(500).json({ error: `Failed to insert entry.` });
      return;
    }

    const newLink = newLinkArr[0];

    if (newLink) {
      res.status(200).json({
        url: newLink.url,
        createdAt: newLink.createdAt!,
        code: newLink.code,
      });
    } else {
      res.status(500).json({ error: `Failed to retrieve the inserted entry.` });
    }
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

async function maintainDB(maxEntries: number) {
  const countResult = await db.select({ count: count() }).from(urlLinks);
  const totalEntries = countResult[0]?.count ?? 0;

  // Delete earliest entries if needed
  if (totalEntries >= maxEntries) {
    const entriesToDelete = totalEntries - maxEntries + 1; // Calculate how many entries to delete
    const earliestEntries = await db
      .select()
      .from(urlLinks)
      .orderBy(asc(urlLinks.createdAt))
      .limit(entriesToDelete);

    // Delete the earliest entries
    for (const entry of earliestEntries) {
      await db.delete(urlLinks).where(eq(urlLinks.id, entry.id));
    }
  }
}

async function getValidCode(): Promise<number> {
  let code;
  const maxAttempt = 5;
  let numAttempt = 0;
  while (true) {
    code = generateCode();

    const existingLink = await db
      .select()
      .from(urlLinks)
      .where(eq(urlLinks.code, code))
      .limit(1);

    // const existingLink = await db.query.urlLinks.findFirst({
    //   with: {
    //     code: code,
    //   },
    // });

    if (existingLink.length < 1) {
      break;
    }

    numAttempt += 1;
    if (numAttempt >= maxAttempt) {
      return 500;
    }
  }

  return code;
}
