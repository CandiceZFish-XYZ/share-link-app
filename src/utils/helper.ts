export function formatDate(createdTime: Date): string {
  return new Date(createdTime).toLocaleString();
}

export function generateCode(): number {
  const min = 1000; // Smallest 4-digit number
  const max = 9999; // Largest 4-digit number

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
