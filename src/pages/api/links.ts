import { type Facetime, PrismaClient } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import {
  type ApiResponse,
  type ErrorResponse,
  type CreateLinkRequest,
} from "~/types/types";
import { generateCode } from "~/utils/helper";

const prismaClient = new PrismaClient();

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Facetime[] | ErrorResponse>>
) {
  try {
    if (!req.query.code) {
      // Fetch top 5 entries sorted by 'desc'
      const response = await prismaClient.facetime.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      });

      res.status(200).json({ data: response || [] });
    } else {
      // Fetch entry by 4-digit code and return 404 if not found
      const code = parseInt(req.query.code as string, 10);
      // if (isNaN(code) || code < 1000 || code > 9999) {
      //   return res
      //     .status(400)
      //     .json({ data: { message: "Invalid code format" } });
      // }

      const response = await prismaClient.facetime.findFirst({
        where: {
          code: code,
        },
      });

      if (response) {
        res.status(200).json({ data: [response] || [] });
      } else {
        res.status(404).json({ data: { message: "Entry not found" } });
      }
    }
  } catch (error) {
    console.error("Error in GET API route:", error);
    res.status(500).json({ data: { message: "Internal server error" } });
    // not showing error or 404.
    // res.status(500).json({ data: { message: `Internal server error - ${error}` } });
  }
}

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Facetime[] | ErrorResponse>>
) {
  try {
    const { link } = req.body as CreateLinkRequest;
    if (!link) {
      return res.status(400).json({ data: { message: "Link is required" } });
    }

    // Generate code & checks for duplication
    let code = generateCode(); // Call the helper function to get a 4-digit code

    let existingLink = await prismaClient.facetime.findFirst({
      where: {
        code: code,
      },
    });

    while (existingLink) {
      code = generateCode();
      existingLink = await prismaClient.facetime.findFirst({
        where: {
          code: code,
        },
      });
    }

    // save to database
    const newLink: Facetime = await (prismaClient.facetime.create({
      data: {
        link,
        code,
      },
    }) as Promise<Facetime>);

    res.status(201).json({ data: [newLink] });
  } catch (error) {
    console.error("Error in POST API route:", error);
    res.status(500).json({ data: { message: "Internal server error" } });
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Facetime[] | ErrorResponse>>
) {
  if (req.method === "GET") {
    return getHandler(req, res);
  } else if (req.method === "POST") {
    return postHandler(req, res);
  } else {
    res.status(405).end(); // Method not allowed
  }
}
