export function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// @ts-ignore
export const fetcher = (...args) => fetch(...args).then((res) => res.json());
