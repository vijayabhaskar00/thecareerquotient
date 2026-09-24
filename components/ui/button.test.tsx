import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders as a real button element and responds to click", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
