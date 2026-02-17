import { store } from "./_lib/store";
import type { RankedVote } from "./_lib/repository";

export function submitBallot(pollId: string, memberId: string, rankedBookIds: string[]) {
  const uniqueIds = new Set(rankedBookIds);
  if (uniqueIds.size !== rankedBookIds.length) {
    throw new Error("Duplicate ranks are not allowed in one ballot.");
  }

  store.votes = store.votes.filter((vote) => !(vote.memberId === memberId && (vote as RankedVote & { pollId?: string }).pollId === pollId));

  rankedBookIds.forEach((bookId, index) => {
    const vote = { memberId, bookId, rankPosition: (index + 1) as 1 | 2 | 3, pollId } as RankedVote & { pollId: string };
    store.votes.push(vote as unknown as RankedVote);
  });
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  try {
    submitBallot(body.pollId, body.memberId, body.rankedBookIds);
    return { statusCode: 204, body: "" };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error instanceof Error ? error.message : "Unexpected error" })
    };
  }
};
