import { type NextApiRequest, type NextApiResponse } from "next";
import { createLink } from "~/apis/create-link";
import { getLinks } from "~/apis/get-links";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET" && !req.query.code) {
    await getLinks(req, res);
  } else if (req.method === "POST") {
    await createLink(req, res);
  } else {
    res.status(405).end(); // Method not allowed
  }
}
