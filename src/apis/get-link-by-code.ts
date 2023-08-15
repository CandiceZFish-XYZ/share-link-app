import { type NextApiRequest, type NextApiResponse } from "next";
import { type ErrorResponse } from "~/types/types";
import { prismaClient } from "./prisma-client";

// Define the response type for the API route
export interface GetLinkByCodeResponse {
  url: string;
  createdAt: Date;
}

export async function getLinkByCode(
  req: NextApiRequest,
  res: NextApiResponse<GetLinkByCodeResponse | ErrorResponse>
) {
  try {
    // Fetch entry by 4-digit code and return 404 if not found
    const code = parseInt(req.query.code as string, 10);

    const response = await prismaClient.urlLinks.findFirst({
      where: {
        code: code,
      },
    });

    if (!response) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    res.status(200).json({ url: response.url, createdAt: response.createdAt });
  } catch (error) {
    console.error("Error in GET link by code API:", error);
    res.status(500).json({ error: `Error in GET link by code API.` });
  }
}
