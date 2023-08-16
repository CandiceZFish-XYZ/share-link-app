import { type NextApiRequest, type NextApiResponse } from "next";
import { getLinkByCode } from "~/apis/get-link-by-code";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET" && req.query.code) {
    await getLinkByCode(req, res);
  } else {
    res.status(405).end(); // Method not allowed
  }
}
