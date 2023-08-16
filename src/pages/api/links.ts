import { type NextApiRequest, type NextApiResponse } from "next";
import { createLink } from "~/apis/create-link";
import { getLinkByCode } from "~/apis/get-link-by-code";
import { getLinks } from "~/apis/get-links";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    // User is not signed in, return a sign-in page
    return res
      .status(401)
      .json({ message: "You need to go to the admin page to sign in." });
  }

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
