export interface SheetsClient {
  readRows: (tab: string) => Promise<Record<string, string>[]>;
  appendRow: (tab: string, row: Record<string, string>) => Promise<void>;
  updateRows: (tab: string, rows: Record<string, string>[]) => Promise<void>;
}

export function createSheetsClient(): SheetsClient {
  return {
    async readRows() {
      return [];
    },
    async appendRow() {},
    async updateRows() {}
  };
}
