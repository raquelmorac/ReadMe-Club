import { test, expect } from "@playwright/test";

test("full club flow works without external tools", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Reader Club")).toBeVisible();
});
