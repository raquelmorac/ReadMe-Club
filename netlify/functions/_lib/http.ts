export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

type EventLike = {
  body?: unknown;
  text?: () => Promise<string>;
  json?: () => Promise<unknown>;
};

export async function parseJsonBody<T = unknown>(event: EventLike): Promise<T> {
  if (typeof event?.json === "function") {
    return (await event.json()) as T;
  }

  if (typeof event?.text === "function") {
    const text = await event.text();
    return (text ? JSON.parse(text) : {}) as T;
  }

  if (typeof event?.body === "string") {
    return (event.body ? JSON.parse(event.body) : {}) as T;
  }

  if (event?.body && typeof event.body === "object") {
    const text = await new Response(event.body as BodyInit).text();
    return (text ? JSON.parse(text) : {}) as T;
  }

  return {} as T;
}
