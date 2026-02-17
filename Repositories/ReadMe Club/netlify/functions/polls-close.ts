import { computeRankedPoints } from "./_lib/repository";
import { store } from "./_lib/store";

export function closePoll(pollId: string) {
  const poll = store.polls.find((entry) => entry.id === pollId);
  if (!poll) {
    throw new Error("Poll not found.");
  }
  poll.status = "closed";

  const votes = store.votes.filter((vote: any) => vote.pollId === pollId);
  const ranking = computeRankedPoints(votes as any);
  return { ranking, statusChanges: [] as string[] };
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  try {
    const result = closePoll(body.pollId);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error instanceof Error ? error.message : "Unexpected error" })
    };
  }
};
