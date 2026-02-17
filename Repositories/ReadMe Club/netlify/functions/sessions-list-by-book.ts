import { store } from "./_lib/store";

export default async (event: { queryStringParameters?: { bookId?: string } }) => {
  const bookId = event.queryStringParameters?.bookId ?? "";
  const sessions = store.sessions.filter((session) => session.bookId === bookId);
  return { statusCode: 200, body: JSON.stringify(sessions) };
};
