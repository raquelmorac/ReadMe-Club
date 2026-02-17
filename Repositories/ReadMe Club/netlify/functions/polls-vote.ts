import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";

export async function submitBallot(pollId: string, memberId: string, rankedBookIds: string[], client: SheetsClient = createSheetsClient()) {
  const uniqueIds = new Set(rankedBookIds);
  if (uniqueIds.size !== rankedBookIds.length) {
    throw new Error("Duplicate ranks are not allowed in one ballot.");
  }

  const votes = await client.readRows("Votes");
  const withoutExistingBallot = votes.filter((vote) => !(vote.poll_id === pollId && vote.member_id === memberId));

  const nowIso = new Date().toISOString();
  const appendedRows = rankedBookIds.map((bookId, index) => ({
    vote_id: `v${Date.now()}_${index}`,
    poll_id: pollId,
    member_id: memberId,
    book_id: bookId,
    rank_position: String(index + 1),
    created_at: nowIso
  }));

  await client.updateRows("Votes", [...withoutExistingBallot, ...appendedRows]);
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  try {
    await submitBallot(body.pollId, body.memberId, body.rankedBookIds);
    return { statusCode: 204, body: "" };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error instanceof Error ? error.message : "Unexpected error" })
    };
  }
};
