import { createSheetsClient, type SheetsClient } from "./_lib/sheetsClient";

export async function deleteRating(ratingId: string, memberId: string, client: SheetsClient = createSheetsClient()) {
  const ratings = await client.readRows("Ratings");
  const index = ratings.findIndex((rating) => rating.rating_id === ratingId && rating.member_id === memberId);
  if (index < 0) {
    throw new Error("Rating not found.");
  }
  const nextRatings = ratings.filter((rating) => !(rating.rating_id === ratingId && rating.member_id === memberId));
  await client.updateRows("Ratings", nextRatings);
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  try {
    await deleteRating(body.ratingId, body.memberId);
    return { statusCode: 204, body: "" };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error instanceof Error ? error.message : "Unexpected error" })
    };
  }
};
