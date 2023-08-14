import { type Facetime } from "@prisma/client";
import { type ApiResponse } from "~/types/types";

export function formatDate(link: Facetime): string {
  return new Date(link.createdAt).toLocaleString();
}

export function generateCode(): number {
  const min = 1000; // Smallest 4-digit number
  const max = 9999; // Largest 4-digit number

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function fetchLinks(): Promise<Facetime[]> {
  try {
    const response = await fetch("/api/links");
    if (!response.ok) {
      throw new Error("Failed to fetch data from API.");
    }

    const data = (await response.json()) as ApiResponse<Facetime[]>;
    return data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function fetchLinkWithCode(code: string): Promise<Facetime[]> {
  try {
    const response = await fetch(`/api/links?code=${code}`);
    if (response.status === 404) {
      throw new Error("Code does not exist.");
    } else if (!response.ok) {
      throw new Error("Failed to fetch link with code from API.");
    }

    const data = (await response.json()) as ApiResponse<Facetime[]>;
    return data.data;
  } catch (error) {
    console.error("Error fetching link with code:", error);
    return [];
  }
}
