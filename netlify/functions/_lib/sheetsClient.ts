export interface SheetsClient {
  readRows: (tab: string) => Promise<Record<string, string>[]>;
  appendRow: (tab: string, row: Record<string, string>) => Promise<void>;
  updateRows: (tab: string, rows: Record<string, string>[]) => Promise<void>;
}

const DEFAULT_SPREADSHEET_ID = "1oG7r8xQQOKw3Q4PCRfDjW9jcRZ_OfzFMKL0xmxiL858";

function getSpreadsheetId() {
  return process.env.GOOGLE_SHEETS_ID ?? DEFAULT_SPREADSHEET_ID;
}

function toCsvExportUrl(spreadsheetId: string, tab: string) {
  const encodedTab = encodeURIComponent(tab);
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodedTab}`;
}

interface WriteRequestBody {
  secret: string;
  action: "append" | "update";
  spreadsheetId: string;
  tab: string;
  row?: Record<string, string>;
  rows?: Record<string, string>[];
}

function getWriteConfig() {
  return {
    url: process.env.GOOGLE_APPS_SCRIPT_URL ?? "",
    secret: process.env.GOOGLE_APPS_SCRIPT_SECRET ?? ""
  };
}

async function postWrite(body: WriteRequestBody) {
  const { url } = getWriteConfig();
  if (!url) {
    throw new Error("GOOGLE_APPS_SCRIPT_URL is required for sheet writes.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets write failed (${response.status}): ${errorText}`);
  }
}

export function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        cell += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ",") {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell.trim());
      cell = "";
      if (row.some((value) => value !== "")) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some((value) => value !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length === 0) {
    return [];
  }
  const [headers, ...dataRows] = rows;
  return dataRows.map((row) => {
    const entry: Record<string, string> = {};
    headers.forEach((header, index) => {
      entry[header] = row[index] ?? "";
    });
    return entry;
  });
}

export function createSheetsClient(): SheetsClient {
  return {
    async readRows(tab) {
      const url = toCsvExportUrl(getSpreadsheetId(), tab);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Sheets read failed for tab "${tab}" (${response.status})`);
      }
      const csv = await response.text();
      const rows = parseCsv(csv);
      return rowsToObjects(rows);
    },
    async appendRow(tab, row) {
      const { secret } = getWriteConfig();
      if (!secret) {
        throw new Error("GOOGLE_APPS_SCRIPT_SECRET is required for sheet writes.");
      }
      await postWrite({
        secret,
        action: "append",
        spreadsheetId: getSpreadsheetId(),
        tab,
        row
      });
    },
    async updateRows(tab, rows) {
      const { secret } = getWriteConfig();
      if (!secret) {
        throw new Error("GOOGLE_APPS_SCRIPT_SECRET is required for sheet writes.");
      }
      await postWrite({
        secret,
        action: "update",
        spreadsheetId: getSpreadsheetId(),
        tab,
        rows
      });
    }
  };
}
