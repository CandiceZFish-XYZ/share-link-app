import { type Facetime, PrismaClient } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import {
  type ApiResponse,
  type ErrorResponse,
  type CreateLinkRequest,
} from "~/types/types";

const prismaClient = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Facetime[] | ErrorResponse>>
) {
  try {
    if (req.method === "GET") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const response: Facetime[] = await prismaClient.facetime.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      });
      console.log(response);

      res.status(200).json({ data: response || [] });
    } else if (req.method === "POST") {
      const { link } = req.body as CreateLinkRequest;
      if (!link) {
        return res.status(400).json({ data: { message: "Link is required" } });
      }

      const newLink: Facetime = await (prismaClient.facetime.create({
        data: {
          link,
        },
      }) as Promise<Facetime>);

      res.status(201).json({ data: [newLink] });
    } else {
      res.status(405).end(); // Method not allowed
    }
  } catch (error) {
    console.error("Error in API route:", error);
    res.status(500).json({ data: { message: "Internal server error" } });
  }
}
