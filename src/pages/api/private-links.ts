import { type NextApiRequest, type NextApiResponse } from "next";
import { createLink } from "~/apis/create-link";
import { getLinkByCode } from "~/apis/get-link-by-code";
import { getLinks } from "~/apis/get-links";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    if (req.query.code) {
      await getLinkByCode(req, res);
    } else {
      await getLinks(req, res);
    }
  } else if (req.method === "POST") {
    await createLink(req, res);
  } else {
    res.status(405).end(); // Method not allowed
  }
}
