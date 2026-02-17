import { store } from "./_lib/store";

export interface UpsertSessionPayload {
  id?: string;
  bookId: string;
  sessionDateTime: string;
  pageStart: number;
  pageEnd: number;
}

export function upsertSession(payload: UpsertSessionPayload) {
  const index = store.sessions.findIndex((session) => session.id === payload.id);
  if (index >= 0) {
    store.sessions[index] = {
      ...store.sessions[index],
      ...payload,
      id: store.sessions[index].id
    };
    return store.sessions[index];
  }

  const newSession = {
    id: payload.id ?? `s${Date.now()}`,
    bookId: payload.bookId,
    sessionDateTime: payload.sessionDateTime,
    pageStart: payload.pageStart,
    pageEnd: payload.pageEnd
  };
  store.sessions.push(newSession);
  return newSession;
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  const session = upsertSession(body as UpsertSessionPayload);
  return { statusCode: 200, body: JSON.stringify(session) };
};
