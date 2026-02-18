import { store } from "./_lib/store";
import { createSheetsClient } from "./_lib/sheetsClient";

export default async () => {
  const client = createSheetsClient();
  try {
    const rows = await client.readRows("Members");
    const members = rows.map((row) => ({
      id: row.member_id,
      name: row.name,
      active: row.active === "true"
    }));
    return { statusCode: 200, body: JSON.stringify(members) };
  } catch {
    return { statusCode: 200, body: JSON.stringify(store.members) };
  }
};
