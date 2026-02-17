import { store } from "./_lib/store";

export function createPoll(title: string, bookIds: string[]) {
  const poll = { id: `p${Date.now()}`, title, status: "open" as const, bookIds };
  store.polls.push(poll);
  return poll;
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  const poll = createPoll(body.title, body.bookIds);
  return { statusCode: 201, body: JSON.stringify(poll) };
};
