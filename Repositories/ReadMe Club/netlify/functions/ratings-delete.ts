import { store } from "./_lib/store";

export function deleteRating(ratingId: string, memberId: string) {
  const index = store.ratings.findIndex((rating) => rating.id === ratingId && rating.memberId === memberId);
  if (index < 0) {
    throw new Error("Rating not found.");
  }
  store.ratings.splice(index, 1);
}

export default async (event: { body?: string }) => {
  const body = JSON.parse(event.body ?? "{}");
  try {
    deleteRating(body.ratingId, body.memberId);
    return { statusCode: 204, body: "" };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error instanceof Error ? error.message : "Unexpected error" })
    };
  }
};
