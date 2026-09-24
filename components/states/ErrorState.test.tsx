import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("renders as an alert with the description and calls onRetry when the retry button is clicked", async () => {
    const onRetry = vi.fn();
    render(<ErrorState description="We couldn't submit your request." onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("We couldn't submit your request.");
    await userEvent.click(screen.getByRole("button", { name: "Try Again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders without a retry button when onRetry is not supplied", () => {
    render(<ErrorState description="We couldn't submit your request." />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
