import { type NextApiRequest, type NextApiResponse } from "next";
import { type ErrorResponse } from "~/types/types";
import { generateCode } from "~/utils/helper";
import { prismaClient } from "./prisma-client";

export interface CreateLinkRequest {
  url: string;
}

export interface CreateLinkResponse {
  url: string;
  createdAt: Date;
  code: number;
}

export async function createLink(
  req: NextApiRequest,
  res: NextApiResponse<CreateLinkResponse | ErrorResponse>
) {
  try {
    const { url } = req.body as CreateLinkRequest;
    if (!url) {
      return res.status(400).json({ error: "Url is required" });
    }

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
