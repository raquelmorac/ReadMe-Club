import { store } from "./_lib/store";
import { createSheetsClient } from "./_lib/sheetsClient";
import { json } from "./_lib/http";

export default async () => {
  const client = createSheetsClient();
  try {
    const rows = await client.readRows("Members");
    const members = rows.map((row) => ({
      id: row.member_id,
      name: row.name,
      active: row.active === "true"
    }));
    return json(members);
  } catch {
    return json(store.members);
  }
};
