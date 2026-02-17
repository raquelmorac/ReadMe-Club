import { store } from "./_lib/store";

export default async () => {
  return { statusCode: 200, body: JSON.stringify(store.books) };
};
