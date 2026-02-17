import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";

export async function createPoll(title: string, bookIds: string[], client: SheetsClient = createSheetsClient()) {
  const nowIso = new Date().toISOString();
  const poll = { id: `p${Date.now()}`, title, status: "open" as const, bookIds };
  await client.appendRow("Polls", {
    poll_id: poll.id,
    title: poll.title,
    status: poll.status,
    created_at: nowIso,
    closed_at: ""
  });

  for (const [index, bookId] of bookIds.entries()) {
    await client.appendRow("PollBooks", {
      poll_book_id: `pb${Date.now()}_${index}`,
      poll_id: poll.id,
      book_id: bookId
    });
  }

  return poll;
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  const poll = await createPoll(body.title, body.bookIds);
  return { statusCode: 201, body: JSON.stringify(poll) };
};
