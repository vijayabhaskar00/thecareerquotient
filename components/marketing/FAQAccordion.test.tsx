import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAQAccordion } from "./FAQAccordion";

describe("FAQAccordion", () => {
  it("reveals an answer when its question is clicked", async () => {
    render(<FAQAccordion items={[{ question: "Do you support remote roles?", answer: "Yes, we do." }]} />);
    expect(screen.queryByText("Yes, we do.")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Do you support remote roles?" }));
    expect(screen.getByText("Yes, we do.")).toBeVisible();
  });
});
