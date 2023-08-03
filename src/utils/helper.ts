import { type Facetime } from "@prisma/client";

export const formatDate = (link: Facetime): string => {
  return new Date(link.createdAt).toLocaleString();
};
