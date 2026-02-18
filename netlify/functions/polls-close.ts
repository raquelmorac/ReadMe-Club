import { computeRankedPoints } from "./_lib/repository";
import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";

export async function closePoll(pollId: string, client: SheetsClient = createSheetsClient()) {
  const polls = await client.readRows("Polls");
  const poll = polls.find((entry) => entry.poll_id === pollId);
  if (!poll) {
    throw new Error("Poll not found.");
  }
  const closedAt = new Date().toISOString();
  const nextPolls = polls.map((entry) => {
    if (entry.poll_id !== pollId) {
      return entry;
    }
    return {
      ...entry,
      status: "closed",
      closed_at: closedAt
    };
  });
  await client.updateRows("Polls", nextPolls);

  const votes = await client.readRows("Votes");
  const rankingVotes = votes
    .filter((vote) => vote.poll_id === pollId)
    .map((vote) => ({
      memberId: vote.member_id,
      bookId: vote.book_id,
      rankPosition: Number(vote.rank_position) as 1 | 2 | 3
    }));
  const ranking = computeRankedPoints(rankingVotes);
  return { ranking, statusChanges: [] as string[] };
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  try {
    const result = await closePoll(body.pollId);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error instanceof Error ? error.message : "Unexpected error" })
    };
  }
};
