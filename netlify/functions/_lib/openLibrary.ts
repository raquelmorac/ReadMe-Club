export interface OpenLibraryBookData {
  title: string;
  author: string;
  totalPages?: number;
  subjects?: string[];
}

export async function enrichBook(title: string, author: string): Promise<OpenLibraryBookData> {
  // Placeholder deterministic enrichment for v1 baseline.
  return {
    title,
    author,
    totalPages: 320,
    subjects: ["fiction"]
  };
}
